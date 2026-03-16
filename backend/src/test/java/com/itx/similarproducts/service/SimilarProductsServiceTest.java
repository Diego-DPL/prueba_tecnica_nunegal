package com.itx.similarproducts.service;

import com.itx.similarproducts.dto.ProductDetailResponse;
import com.itx.similarproducts.exception.ProductNotFoundException;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.test.StepVerifier;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

class SimilarProductsServiceTest {

    private MockWebServer mockWebServer;
    private SimilarProductsService service;

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        WebClient webClient = WebClient.builder()
                .baseUrl(mockWebServer.url("/").toString())
                .build();

        service = new SimilarProductsService(webClient);
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    @DisplayName("Should return similar products when all upstream calls succeed")
    void shouldReturnSimilarProducts() {
        mockWebServer.enqueue(new MockResponse()
                .setBody("[\"2\", \"3\"]")
                .addHeader("Content-Type", "application/json"));

        mockWebServer.enqueue(new MockResponse()
                .setBody("{\"id\":\"2\",\"name\":\"Shirt\",\"price\":19.99,\"availability\":true}")
                .addHeader("Content-Type", "application/json"));

        mockWebServer.enqueue(new MockResponse()
                .setBody("{\"id\":\"3\",\"name\":\"Pants\",\"price\":39.99,\"availability\":false}")
                .addHeader("Content-Type", "application/json"));

        StepVerifier.create(service.getSimilarProducts("1"))
                .assertNext(products -> {
                    assertThat(products).hasSize(2);
                    assertThat(products).extracting(ProductDetailResponse::getId)
                            .containsExactlyInAnyOrder("2", "3");
                })
                .verifyComplete();
    }

    @Test
    @DisplayName("Should return empty list when product has no similar products")
    void shouldReturnEmptyListWhenNoSimilarProducts() {
        mockWebServer.enqueue(new MockResponse()
                .setBody("[]")
                .addHeader("Content-Type", "application/json"));

        StepVerifier.create(service.getSimilarProducts("1"))
                .assertNext(products -> assertThat(products).isEmpty())
                .verifyComplete();
    }

    @Test
    @DisplayName("Should throw ProductNotFoundException when product does not exist")
    void shouldThrowNotFoundWhenProductDoesNotExist() {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(404)
                .addHeader("Content-Type", "application/json"));

        StepVerifier.create(service.getSimilarProducts("999"))
                .expectError(ProductNotFoundException.class)
                .verify();
    }

    @Test
    @DisplayName("Should skip products that fail to resolve and return the rest")
    void shouldSkipFailedProductDetailsAndReturnRest() {
        mockWebServer.enqueue(new MockResponse()
                .setBody("[\"2\", \"3\", \"4\"]")
                .addHeader("Content-Type", "application/json"));

        mockWebServer.enqueue(new MockResponse()
                .setBody("{\"id\":\"2\",\"name\":\"Shirt\",\"price\":19.99,\"availability\":true}")
                .addHeader("Content-Type", "application/json"));

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(404)
                .addHeader("Content-Type", "application/json"));

        mockWebServer.enqueue(new MockResponse()
                .setBody("{\"id\":\"4\",\"name\":\"Jacket\",\"price\":89.99,\"availability\":true}")
                .addHeader("Content-Type", "application/json"));

        StepVerifier.create(service.getSimilarProducts("1"))
                .assertNext(products -> {
                    assertThat(products).hasSize(2);
                    assertThat(products).extracting(ProductDetailResponse::getId)
                            .containsExactlyInAnyOrder("2", "4");
                })
                .verifyComplete();
    }
}
