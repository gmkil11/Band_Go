package com.portfolio.band_go.services;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SupabaseService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode getGroupProfile(String groupId) throws Exception {
        String url = String.format("%s/rest/v1/groups?select=*&group_id=eq.%s", supabaseUrl, groupId);

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(url);
            request.setHeader("apikey", supabaseKey);
            request.setHeader("Authorization", "Bearer " + supabaseKey);

            try (CloseableHttpResponse response = client.execute(request)) {
                String json = EntityUtils.toString(response.getEntity());
                return objectMapper.readTree(json);
            }
        }
    }
}

