package com.portfolio.band_go.rest_controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class MemberRestController {

    private final RestTemplate restTemplate;
    private final String supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6b3FvcmNneWF0d21vYWZrZmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NDg3MDQsImV4cCI6MjAyNjQyNDcwNH0.sOC91NnK94dqgloyKq5LKqH9nwyVrrUXgQJJn0whyZg";

    @Autowired
    public MemberRestController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/getUsers")
    public String getUserEmail() {
        String apiUrl = "https://kzoqorcgyatwmoafkfcb.supabase.co/rest/v1/users?select=email";

        try {
            // HTTP 요청 헤더에 API 키 추가
            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", supabaseApiKey);

            // HTTP 요청 엔터티 생성 (헤더 포함)
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // API 요청 보내기 (GET)
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);

            // 응답 확인
            String responseBody = response.getBody();
            return responseBody;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
