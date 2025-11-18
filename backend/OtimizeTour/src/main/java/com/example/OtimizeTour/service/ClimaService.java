package com.example.OtimizeTour.service;

import com.example.OtimizeTour.model.ClimaModel;
import com.example.OtimizeTour.model.RoteiroModel;
import com.example.OtimizeTour.repository.ClimaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClimaService {

    private final ClimaRepository repository;
    private final RoteiroService roteiroService;

    public ClimaService(ClimaRepository repository, RoteiroService roteiroService) {
        this.repository = repository;
        this.roteiroService = roteiroService;
    }

    public List<ClimaModel> listar() {
        return repository.findAll();
    }

    public ClimaModel buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public ClimaModel salvar(ClimaModel clima) {
        return repository.save(clima);
    }

    public ClimaModel salvarComRoteiro(ClimaModel clima, Integer roteiroId) {
        RoteiroModel roteiro = roteiroService.buscarPorId(roteiroId);
        clima.setRoteiro(roteiro);
        return repository.save(clima);
    }

    public ClimaModel atualizar(Integer id, ClimaModel novoClima) {
        return repository.findById(id).map(c -> {
            c.setClimaAtual(novoClima.getClimaAtual());
            c.setRoteiro(novoClima.getRoteiro());
            return repository.save(c);
        }).orElse(null);
    }

    public boolean excluir(Integer id) {
        return repository.findById(id).map(c -> {
            repository.delete(c);
            return true;
        }).orElse(false);
    }
}
