package com.api.userservice.services;

import com.api.userservice.models.Cliente;
import com.api.userservice.repositories.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente registrarCliente(Cliente cliente) {
        if (clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new RuntimeException("El email ya se encuentra registrado");
        }
        if (cliente.getFechaRegistro() == null) {
            cliente.setFechaRegistro(java.time.LocalDateTime.now());
        }
        if (cliente.getActivo() == null) {
            cliente.setActivo(true);
        }
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> obtenerPorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }

    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }
}
