package com.example.OtimizeTour.service;

import com.example.OtimizeTour.model.RoteiroModel;
import com.example.OtimizeTour.repository.RoteiroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoteiroService {

    private final RoteiroRepository repository;

    public RoteiroService(RoteiroRepository repository) {
        this.repository = repository;
    }

    public List<RoteiroModel> listarTodos() {
        return repository.findAll();
    }

    public RoteiroModel salvar(RoteiroModel roteiro) {
        return repository.save(roteiro);
    }

    public RoteiroModel buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }
}
