package com.example.OtimizeTour.service;

import com.example.OtimizeTour.model.CategoriaModel;
import com.example.OtimizeTour.model.PontoInteresseModel;
import com.example.OtimizeTour.repository.PontoInteresseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PontoInteresseService {

    private final PontoInteresseRepository repository;
    private final CategoriaService categoriaService;

    public PontoInteresseService(PontoInteresseRepository repository, CategoriaService categoriaService) {
        this.repository = repository;
        this.categoriaService = categoriaService;
    }

    public List<PontoInteresseModel> listar() {
        return repository.findAll();
    }

    public PontoInteresseModel buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public PontoInteresseModel salvar(PontoInteresseModel ponto) {
        return repository.save(ponto);
    }

    public PontoInteresseModel salvarComCategoria(PontoInteresseModel ponto, Integer categoriaId) {
        CategoriaModel categoria = categoriaService.buscarPorId(categoriaId);
        ponto.setCategoria(categoria);
        return repository.save(ponto);
    }

    public PontoInteresseModel atualizar(Integer id, PontoInteresseModel novoPonto) {
        return repository.findById(id).map(p -> {
            p.setNome(novoPonto.getNome());
            p.setDescricao(novoPonto.getDescricao());
            p.setAvaliacaoMedia(novoPonto.getAvaliacaoMedia());
            p.setCategoria(novoPonto.getCategoria());
            return repository.save(p);
        }).orElse(null);
    }

    public boolean excluir(Integer id) {
        return repository.findById(id).map(p -> {
            repository.delete(p);
            return true;
        }).orElse(false);
    }

    public PontoInteresseModel avaliar(Integer id, float avaliacao) {
        return repository.findById(id).map(p -> {
            p.avaliar(avaliacao);
            return repository.save(p);
        }).orElse(null);
    }
}
