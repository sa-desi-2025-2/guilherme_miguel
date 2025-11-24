package com.example.OtimizeTour.controller.api;

import com.example.OtimizeTour.model.CategoriaModel;
import com.example.OtimizeTour.service.CategoriaService;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @PostMapping
    public CategoriaModel criarCategoria(@RequestBody CategoriaModel categoria) {
        return service.cadastrarCategoria(categoria);
    }

    @GetMapping
    public List<CategoriaModel> listar() {
        return service.listarCategorias();
    }

    @GetMapping("/{id}")
    public CategoriaModel buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        service.deletar(id);
    }
}
