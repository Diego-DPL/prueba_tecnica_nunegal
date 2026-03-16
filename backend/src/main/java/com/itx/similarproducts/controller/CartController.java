package com.itx.similarproducts.controller;

import com.itx.similarproducts.dto.AddToCartRequest;
import com.itx.similarproducts.dto.CartResponse;
import com.itx.similarproducts.service.PhoneShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "Shopping cart operations")
public class CartController {

    private final PhoneShopService phoneShopService;

    @PostMapping
    @Operation(
            summary = "Add product to cart",
            description = "Adds a phone with selected color and storage to the shopping cart"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Product added to cart successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CartResponse.class)
                    )
            )
    })
    public Mono<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return phoneShopService.addToCart(request);
    }
}
