package com.api.authservice.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${user.service.url:http://localhost:8082}")
    private String userServiceUrl;

    public Map<String, Object> registerUser(Map<String, Object> clienteData) {
        String url = userServiceUrl + "/api/clientes/registro";
        ResponseEntity<Map> response = restTemplate.postForEntity(url, clienteData, Map.class);
        return response.getBody();
    }

    public Map<String, Object> authenticateUser(String email, String password) {
        String url = userServiceUrl + "/api/clientes/email/" + email;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> cliente = response.getBody();

            if (cliente == null) {
                throw new RuntimeException("Credenciales inválidas");
            }

            String storedPassword = (String) cliente.get("password");
            if (storedPassword != null && !storedPassword.equals(password)) {
                throw new RuntimeException("Credenciales inválidas");
            }

            Boolean activo = (Boolean) cliente.get("activo");
            if (Boolean.FALSE.equals(activo)) {
                throw new RuntimeException("Cuenta inactiva");
            }

            return Map.of(
                "message", "Autenticación exitosa",
                "cliente", cliente,
                "token", "token-demo-" + System.currentTimeMillis()
            );
        } catch (Exception e) {
            throw new RuntimeException("Error de autenticación: " + e.getMessage());
        }
    }
}
