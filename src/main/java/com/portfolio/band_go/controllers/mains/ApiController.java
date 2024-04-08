package com.portfolio.band_go.controllers.mains;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class ApiController {

    private final RestTemplate restTemplate;

    public ApiController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchNaverAPI(@RequestParam String query) {
        String apiUrl = "https://openapi.naver.com/v1/search/local.json?query=" + query;
        ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
        return response;
    }
}
