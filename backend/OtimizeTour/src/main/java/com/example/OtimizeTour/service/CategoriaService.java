package com.example.OtimizeTour.service;
import com.example.OtimizeTour.model.CategoriaModel;
import com.example.OtimizeTour.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public CategoriaModel cadastrarCategoria(CategoriaModel categoria) {
        return repository.save(categoria);
    }

    public List<CategoriaModel> listarCategorias() {
        return repository.findAll();
    }

    public CategoriaModel buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }
}
