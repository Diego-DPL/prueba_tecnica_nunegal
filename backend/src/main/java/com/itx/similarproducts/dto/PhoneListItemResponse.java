package com.itx.similarproducts.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Phone summary for product listing")
public class PhoneListItemResponse {

    @Schema(description = "Phone identifier", example = "ZmGrkLRPXOTpxsU4jjAcv")
    private String id;

    @Schema(description = "Brand name", example = "Samsung")
    private String brand;

    @Schema(description = "Model name", example = "Galaxy S21")
    private String model;

    @Schema(description = "Price in EUR", example = "799")
    private String price;

    @Schema(description = "Image URL", example = "https://itx-frontend-test.onrender.com/images/example.jpg")
    private String imgUrl;
}
