package com.ccb.piedade.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableScheduling
public class KeepAliveConfig {

    private static final Logger log = LoggerFactory.getLogger(KeepAliveConfig.class);

    @Value("${app.keep-alive.url:}")
    private String keepAliveUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 14 * 60 * 1000) // a cada 14 minutos
    public void keepAlive() {
        if (keepAliveUrl == null || keepAliveUrl.isBlank()) {
            return;
        }
        try {
            restTemplate.getForEntity(keepAliveUrl + "/api/health", String.class);
            log.info("Keep-alive ping enviado com sucesso");
        } catch (Exception e) {
            log.warn("Falha no keep-alive ping: {}", e.getMessage());
        }
    }
}
