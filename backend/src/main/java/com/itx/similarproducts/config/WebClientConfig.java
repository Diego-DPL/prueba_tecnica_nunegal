package com.itx.similarproducts.config;

import io.netty.channel.ChannelOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Value("${external-api.base-url}")
    private String baseUrl;

    @Value("${external-api.timeout}")
    private int timeout;

    @Value("${phone-shop-api.base-url}")
    private String phoneShopBaseUrl;

    @Value("${phone-shop-api.timeout}")
    private int phoneShopTimeout;

    @Bean("similarProductsWebClient")
    public WebClient similarProductsWebClient(WebClient.Builder builder) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, timeout)
                .responseTimeout(Duration.ofMillis(timeout));

        return builder
                .baseUrl(baseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @Bean("phoneShopWebClient")
    public WebClient phoneShopWebClient(WebClient.Builder builder) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, phoneShopTimeout)
                .responseTimeout(Duration.ofMillis(phoneShopTimeout));

        return builder
                .clone()
                .baseUrl(phoneShopBaseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
