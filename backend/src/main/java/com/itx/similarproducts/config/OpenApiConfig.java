package com.itx.similarproducts.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ITX Products API")
                        .version("1.0.0")
                        .description("REST API that provides:\n"
                                + "- Similar products aggregation from upstream microservices\n"
                                + "- Phone shop catalog with full product details\n\n"
                                + "Built as a BFF (Backend for Frontend) for the ITX technical test.")
                        .contact(new Contact()
                                .name("ITX Technical Test")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local development server")
                ));
    }
}
