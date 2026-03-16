package com.itx.similarproducts.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Product detail information")
public class ProductDetailResponse {

    @NotBlank
    @Schema(description = "Product identifier", example = "1")
    private String id;

    @NotBlank
    @Schema(description = "Product name", example = "Dress")
    private String name;

    @NotNull
    @Schema(description = "Product price", example = "29.99")
    private Double price;

    @NotNull
    @Schema(description = "Product availability", example = "true")
    private Boolean availability;
}
