package com.example.OtimizeTour.service;
import com.example.OtimizeTour.model.CategoriaModal;
import com.example.OtimizeTour.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    // parecido com o "cadastrarCategoria()" do UML
    public CategoriaModal cadastrarCategoria(CategoriaModal categoria) {
        return repository.save(categoria);
    }

    public List<CategoriaModal> listarCategorias() {
        return repository.findAll();
    }

    public CategoriaModal buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }
}
