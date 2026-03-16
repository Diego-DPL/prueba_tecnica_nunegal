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
@Schema(description = "Cart response with total item count")
public class CartResponse {

    @Schema(description = "Total number of items in the cart", example = "3")
    private int count;
}
