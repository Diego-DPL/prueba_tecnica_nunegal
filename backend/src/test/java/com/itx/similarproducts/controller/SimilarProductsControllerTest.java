package com.itx.similarproducts.controller;

import com.itx.similarproducts.dto.ProductDetailResponse;
import com.itx.similarproducts.exception.ProductNotFoundException;
import com.itx.similarproducts.service.SimilarProductsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.mockito.Mockito.when;

@WebFluxTest(SimilarProductsController.class)
class SimilarProductsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockitoBean
    private SimilarProductsService similarProductsService;

    @Test
    @DisplayName("GET /product/{id}/similar should return 200 with similar products")
    void shouldReturnSimilarProducts() {
        List<ProductDetailResponse> products = List.of(
                ProductDetailResponse.builder().id("2").name("Shirt").price(19.99).availability(true).build(),
                ProductDetailResponse.builder().id("3").name("Pants").price(39.99).availability(false).build()
        );

        when(similarProductsService.getSimilarProducts("1")).thenReturn(Mono.just(products));

        webTestClient.get().uri("/product/1/similar")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$[0].id").isEqualTo("2")
                .jsonPath("$[0].name").isEqualTo("Shirt")
                .jsonPath("$[0].price").isEqualTo(19.99)
                .jsonPath("$[0].availability").isEqualTo(true)
                .jsonPath("$[1].id").isEqualTo("3");
    }

    @Test
    @DisplayName("GET /product/{id}/similar should return 404 when product not found")
    void shouldReturn404WhenProductNotFound() {
        when(similarProductsService.getSimilarProducts("999"))
                .thenReturn(Mono.error(new ProductNotFoundException("999")));

        webTestClient.get().uri("/product/999/similar")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    @DisplayName("GET /product/{id}/similar should return empty array when no similar products")
    void shouldReturnEmptyArrayWhenNoSimilarProducts() {
        when(similarProductsService.getSimilarProducts("1")).thenReturn(Mono.just(List.of()));

        webTestClient.get().uri("/product/1/similar")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$").isArray()
                .jsonPath("$.length()").isEqualTo(0);
    }
}
