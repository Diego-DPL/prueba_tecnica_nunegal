package com.itx.similarproducts.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to add a product to the cart")
public class AddToCartRequest {

    @NotBlank
    @Size(max = 100)
    @Schema(description = "Phone identifier", example = "ZmGrkLRPXOTpxsU4jjAcv")
    private String id;

    @NotNull
    @Schema(description = "Selected color code", example = "1000")
    private Integer colorCode;

    @NotNull
    @Schema(description = "Selected storage code", example = "2000")
    private Integer storageCode;
}
