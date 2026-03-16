package com.itx.similarproducts.service;

import com.itx.similarproducts.dto.AddToCartRequest;
import com.itx.similarproducts.dto.CartResponse;
import com.itx.similarproducts.dto.PhoneDetailResponse;
import com.itx.similarproducts.dto.PhoneListItemResponse;
import com.itx.similarproducts.exception.ProductNotFoundException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
public class PhoneShopService {

    private final WebClient phoneShopWebClient;

    public PhoneShopService(@Qualifier("phoneShopWebClient") WebClient phoneShopWebClient) {
        this.phoneShopWebClient = phoneShopWebClient;
    }

    @CircuitBreaker(name = "phoneShopService", fallbackMethod = "getAllPhonesFallback")
    public Mono<List<PhoneListItemResponse>> getAllPhones() {
        log.debug("Fetching all phones from external API");

        return phoneShopWebClient.get()
                .uri("/api/product")
                .retrieve()
                .bodyToFlux(PhoneListItemResponse.class)
                .collectList()
                .doOnNext(phones -> log.debug("Fetched {} phones", phones.size()));
    }

    @CircuitBreaker(name = "phoneShopService", fallbackMethod = "getPhoneDetailFallback")
    public Mono<PhoneDetailResponse> getPhoneDetail(String phoneId) {
        log.debug("Fetching phone detail for id: {}", phoneId);

        return phoneShopWebClient.get()
                .uri("/api/product/{phoneId}", phoneId)
                .retrieve()
                .bodyToMono(PhoneDetailResponse.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    if (ex.getStatusCode() == HttpStatus.NOT_FOUND) {
                        log.warn("Phone {} not found", phoneId);
                        return Mono.error(new ProductNotFoundException(phoneId));
                    }
                    return Mono.error(ex);
                });
    }

    private Mono<List<PhoneListItemResponse>> getAllPhonesFallback(Throwable t) {
        log.warn("Circuit breaker fallback for getAllPhones: {}", t.getMessage());
        return Mono.just(List.of());
    }

    private Mono<PhoneDetailResponse> getPhoneDetailFallback(String phoneId, Throwable t) {
        if (t instanceof ProductNotFoundException) {
            return Mono.error(t);
        }
        log.warn("Circuit breaker fallback for getPhoneDetail {}: {}", phoneId, t.getMessage());
        return Mono.error(new ProductNotFoundException(phoneId));
    }

    public Mono<CartResponse> addToCart(AddToCartRequest request) {
        log.debug("Adding to cart: phone={}, color={}, storage={}", request.getId(), request.getColorCode(), request.getStorageCode());

        return phoneShopWebClient.post()
                .uri("/api/cart")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(CartResponse.class);
    }
}
