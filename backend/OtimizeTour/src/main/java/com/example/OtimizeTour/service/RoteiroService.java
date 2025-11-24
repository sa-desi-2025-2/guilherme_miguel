package com.example.OtimizeTour.service;

import com.example.OtimizeTour.model.RoteiroModel;
import com.example.OtimizeTour.repository.RoteiroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RoteiroService {

    private final RoteiroRepository repository;

    public RoteiroService(RoteiroRepository repository) {
        this.repository = repository;
    }

    // -------- GERAR TOKEN -----------
    private String gerarToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    // -------- LISTAR TODOS ----------
    public List<RoteiroModel> listarTodos() {
        return repository.findAll();
    }

    // -------- SALVAR ROTEIRO --------
    public RoteiroModel salvar(RoteiroModel roteiro) {

        // Se for um novo cadastro, gera o token
        if (roteiro.getId() == null) {
            roteiro.setShareToken(gerarToken());
        }

        return repository.save(roteiro);
    }

    // -------- BUSCAR POR ID ----------
    public RoteiroModel buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // -------- BUSCAR POR TOKEN --------
    public RoteiroModel buscarPorToken(String token) {
        return repository.findByShareToken(token).orElse(null);
    }

    // -------- DELETAR -----------------
    public void deletar(Integer id) {
        repository.deleteById(id);
    }
}
