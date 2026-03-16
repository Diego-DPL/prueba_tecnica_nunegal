package com.itx.similarproducts.controller;

import com.itx.similarproducts.dto.ProductDetailResponse;
import com.itx.similarproducts.service.SimilarProductsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Similar Products", description = "Operations to retrieve similar products")
public class SimilarProductsController {

    private final SimilarProductsService similarProductsService;

    @GetMapping("/product/{productId}/similar")
    @Operation(
            summary = "Get similar products",
            description = "Returns the product detail of the similar products for a given product ID, ordered by similarity"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "List of similar products retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ProductDetailResponse.class))
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content
            )
    })
    public Mono<List<ProductDetailResponse>> getSimilarProducts(
            @Parameter(description = "Product identifier", required = true, example = "1")
            @PathVariable String productId) {
        return similarProductsService.getSimilarProducts(productId);
    }
}
