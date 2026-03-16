package com.itx.similarproducts.service;

import com.itx.similarproducts.dto.ProductDetailResponse;
import com.itx.similarproducts.exception.ProductNotFoundException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
public class SimilarProductsService {

    private final WebClient similarProductsWebClient;

    public SimilarProductsService(@Qualifier("similarProductsWebClient") WebClient similarProductsWebClient) {
        this.similarProductsWebClient = similarProductsWebClient;
    }

    @CircuitBreaker(name = "productService", fallbackMethod = "getSimilarProductsFallback")
    public Mono<List<ProductDetailResponse>> getSimilarProducts(String productId) {
        log.debug("Fetching similar products for productId: {}", productId);

        return fetchSimilarIds(productId)
                .flatMapMany(Flux::fromIterable)
                .flatMap(this::fetchProductDetail)
                .collectList();
    }

    private Mono<List<ProductDetailResponse>> getSimilarProductsFallback(String productId, Throwable t) {
        if (t instanceof ProductNotFoundException) {
            return Mono.error(t);
        }
        log.warn("Circuit breaker fallback for product {}: {}", productId, t.getMessage());
        return Mono.just(List.of());
    }

    private Mono<List<String>> fetchSimilarIds(String productId) {
        return similarProductsWebClient.get()
                .uri("/product/{productId}/similarids", productId)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .onErrorResume(WebClientResponseException.class, ex -> {
                    if (ex.getStatusCode() == HttpStatus.NOT_FOUND) {
                        log.warn("Product {} not found in upstream service", productId);
                        return Mono.error(new ProductNotFoundException(productId));
                    }
                    log.error("Error fetching similar IDs for product {}: {}", productId, ex.getMessage());
                    return Mono.error(ex);
                });
    }

    private Mono<ProductDetailResponse> fetchProductDetail(String productId) {
        return similarProductsWebClient.get()
                .uri("/product/{productId}", productId)
                .retrieve()
                .bodyToMono(ProductDetailResponse.class)
                .doOnNext(p -> log.debug("Fetched detail for product: {}", p.getId()))
                .onErrorResume(ex -> {
                    log.warn("Could not fetch detail for product {}: {}. Skipping.", productId, ex.getMessage());
                    return Mono.empty();
                });
    }
}
