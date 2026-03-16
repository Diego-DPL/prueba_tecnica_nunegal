package com.itx.similarproducts.controller;

import com.itx.similarproducts.dto.PhoneDetailResponse;
import com.itx.similarproducts.dto.PhoneListItemResponse;
import com.itx.similarproducts.service.PhoneShopService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/phones")
@Tag(name = "Phone Shop", description = "Operations to browse and retrieve phone details")
public class PhoneShopController {

    private final PhoneShopService phoneShopService;

    @GetMapping
    @Operation(
            summary = "Get all phones",
            description = "Returns a list of all available phones with basic information"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "List of phones retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = PhoneListItemResponse.class))
                    )
            )
    })
    public Mono<List<PhoneListItemResponse>> getAllPhones() {
        return phoneShopService.getAllPhones();
    }

    @GetMapping("/{phoneId}")
    @Operation(
            summary = "Get phone detail",
            description = "Returns full detail information for a specific phone"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Phone detail retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PhoneDetailResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Phone not found",
                    content = @Content
            )
    })
    public Mono<PhoneDetailResponse> getPhoneDetail(
            @Parameter(description = "Phone identifier", required = true)
            @PathVariable String phoneId) {
        return phoneShopService.getPhoneDetail(phoneId);
    }
}
