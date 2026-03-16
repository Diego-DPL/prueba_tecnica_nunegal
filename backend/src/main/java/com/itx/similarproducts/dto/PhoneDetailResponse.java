package com.itx.similarproducts.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Full phone detail information")
public class PhoneDetailResponse {

    @Schema(description = "Phone identifier")
    private String id;

    @Schema(description = "Brand name")
    private String brand;

    @Schema(description = "Model name")
    private String model;

    @Schema(description = "Price in EUR")
    private String price;

    @Schema(description = "Image URL")
    private String imgUrl;

    @Schema(description = "Network technology")
    private String networkTechnology;

    @Schema(description = "Network speed")
    private String networkSpeed;

    @Schema(description = "GPRS support")
    private String gprs;

    @Schema(description = "EDGE support")
    private String edge;

    @Schema(description = "Announcement date")
    private String announced;

    @Schema(description = "Availability status")
    private String status;

    @Schema(description = "Physical dimensions")
    private String dimentions;

    @Schema(description = "Weight in grams")
    private String weight;

    @Schema(description = "SIM card type")
    private String sim;

    @Schema(description = "Display technology")
    private String displayType;

    @Schema(description = "Display resolution")
    private String displayResolution;

    @Schema(description = "Display size")
    private String displaySize;

    @Schema(description = "Operating system")
    private String os;

    @Schema(description = "CPU details")
    private String cpu;

    @Schema(description = "Chipset")
    private String chipset;

    @Schema(description = "GPU details")
    private String gpu;

    @Schema(description = "External memory support")
    private String externalMemory;

    @Schema(description = "Internal memory options")
    private List<String> internalMemory;

    @Schema(description = "RAM capacity")
    private String ram;

    @Schema(description = "Primary camera specs")
    private List<String> primaryCamera;

    @JsonProperty("secondaryCmera")
    @Schema(description = "Secondary camera specs")
    private List<String> secondaryCamera;

    @Schema(description = "Speaker")
    private String speaker;

    @Schema(description = "Audio jack")
    private String audioJack;

    @Schema(description = "WiFi specs")
    private List<String> wlan;

    @Schema(description = "Bluetooth specs")
    private List<String> bluetooth;

    @Schema(description = "GPS support")
    private String gps;

    @Schema(description = "NFC support")
    private String nfc;

    @Schema(description = "Radio support")
    private String radio;

    @Schema(description = "USB type")
    private String usb;

    @Schema(description = "Sensors")
    private List<String> sensors;

    @Schema(description = "Battery details")
    private String battery;

    @Schema(description = "Available colors")
    private List<String> colors;

    @Schema(description = "Configuration options")
    private PhoneOptions options;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Phone configuration options")
    public static class PhoneOptions {
        @Schema(description = "Available color options")
        private List<ColorOption> colors;

        @Schema(description = "Available storage options")
        private List<StorageOption> storages;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Color option")
    public static class ColorOption {
        private int code;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Storage option")
    public static class StorageOption {
        private int code;
        private String name;
    }
}
