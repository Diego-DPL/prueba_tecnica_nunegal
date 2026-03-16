package com.itx.similarproducts.controller;

import com.itx.similarproducts.dto.PhoneDetailResponse;
import com.itx.similarproducts.dto.PhoneListItemResponse;
import com.itx.similarproducts.exception.ProductNotFoundException;
import com.itx.similarproducts.service.PhoneShopService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.mockito.Mockito.when;

@WebFluxTest(controllers = PhoneShopController.class)
class PhoneShopControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockitoBean
    private PhoneShopService phoneShopService;

    @Test
    @DisplayName("GET /api/phones should return 200 with list of phones")
    void shouldReturnAllPhones() {
        List<PhoneListItemResponse> phones = List.of(
                PhoneListItemResponse.builder()
                        .id("abc123").brand("Samsung").model("Galaxy S21").price("799").imgUrl("http://img/1.jpg").build(),
                PhoneListItemResponse.builder()
                        .id("def456").brand("Apple").model("iPhone 13").price("999").imgUrl("http://img/2.jpg").build()
        );

        when(phoneShopService.getAllPhones()).thenReturn(Mono.just(phones));

        webTestClient.get().uri("/api/phones")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$[0].id").isEqualTo("abc123")
                .jsonPath("$[0].brand").isEqualTo("Samsung")
                .jsonPath("$[1].model").isEqualTo("iPhone 13");
    }

    @Test
    @DisplayName("GET /api/phones/{id} should return 200 with phone detail")
    void shouldReturnPhoneDetail() {
        PhoneDetailResponse phone = PhoneDetailResponse.builder()
                .id("abc123").brand("Samsung").model("Galaxy S21").price("799")
                .imgUrl("http://img/1.jpg").os("Android 11").cpu("Exynos 2100")
                .ram("8 GB RAM").battery("4000 mAh")
                .build();

        when(phoneShopService.getPhoneDetail("abc123")).thenReturn(Mono.just(phone));

        webTestClient.get().uri("/api/phones/abc123")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.id").isEqualTo("abc123")
                .jsonPath("$.brand").isEqualTo("Samsung")
                .jsonPath("$.os").isEqualTo("Android 11");
    }

    @Test
    @DisplayName("GET /api/phones/{id} should return 404 when phone not found")
    void shouldReturn404WhenPhoneNotFound() {
        when(phoneShopService.getPhoneDetail("nonexistent"))
                .thenReturn(Mono.error(new ProductNotFoundException("nonexistent")));

        webTestClient.get().uri("/api/phones/nonexistent")
                .exchange()
                .expectStatus().isNotFound();
    }
}
