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

    private String gerarToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    public List<RoteiroModel> listarTodos() {
        return repository.findAll();
    }

    public RoteiroModel salvar(RoteiroModel roteiro) {

        if (roteiro.getId() == null) {
            roteiro.setShareToken(gerarToken());
        }

        return repository.save(roteiro);
    }

    public RoteiroModel buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public RoteiroModel buscarPorToken(String token) {
        return repository.findByShareToken(token).orElse(null);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }
}
