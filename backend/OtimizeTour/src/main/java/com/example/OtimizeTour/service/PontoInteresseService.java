package com.example.OtimizeTour.service;
import com.example.OtimizeTour.model.PontoInteresseModal;
import com.example.OtimizeTour.repository.PontoInteresseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PontoInteresseService {

    private final PontoInteresseRepository repository;

    public PontoInteresseService(PontoInteresseRepository repository) {
        this.repository = repository;
    }

    public List<PontoInteresseModal> listar() {
        return repository.findAll();
    }

    public PontoInteresseModal buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public PontoInteresseModal salvar(PontoInteresseModal ponto) {
        return repository.save(ponto);
    }

    public PontoInteresseModal atualizar(Integer id, PontoInteresseModal novoPonto) {
        return repository.findById(id).map(p -> {
            p.setNome(novoPonto.getNome());
            p.setDescricao(novoPonto.getDescricao());
            p.setAvaliacaoMedia(novoPonto.getAvaliacaoMedia());
            return repository.save(p);
        }).orElse(null);
    }

    public boolean excluir(Integer id) {
        return repository.findById(id).map(p -> {
            repository.delete(p);
            return true;
        }).orElse(false);
    }

    public PontoInteresseModal avaliar(Integer id, float avaliacao) {
        return repository.findById(id).map(p -> {
            p.avaliar(avaliacao);
            return repository.save(p);
        }).orElse(null);
    }
}
