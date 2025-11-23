package com.example.OtimizeTour.controller.api;

import com.example.OtimizeTour.model.PontoInteresseModel;
import com.example.OtimizeTour.service.PontoInteresseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pontosInteresse")
public class PontoInteresseController {

    private final PontoInteresseService service;

    public PontoInteresseController(PontoInteresseService service) {
        this.service = service;
    }

    @GetMapping
    public List<PontoInteresseModel> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PontoInteresseModel buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public PontoInteresseModel criar(@RequestBody PontoInteresseModel ponto) {
        return service.salvar(ponto);
    }

    @PostMapping("/categoria/{categoriaId}")
    public PontoInteresseModel criarComCategoria(
            @PathVariable Integer categoriaId,
            @RequestParam Integer roteiroId,
            @RequestBody PontoInteresseModel ponto) {
        return service.salvarComCategoria(ponto, categoriaId, roteiroId);
    }

    @PutMapping("/{id}")
    public PontoInteresseModel atualizar(@PathVariable Integer id, @RequestBody PontoInteresseModel ponto) {
        return service.atualizar(id, ponto);
    }

    @DeleteMapping("/{id}")
    public boolean excluir(@PathVariable Integer id) {
        return service.excluir(id);
    }

    @PostMapping("/{id}/avaliar")
    public PontoInteresseModel avaliar(@PathVariable Integer id, @RequestParam float valor) {
        return service.avaliar(id, valor);
    }

    @GetMapping("/roteiro/{roteiroId}")
    public List<PontoInteresseModel> listarPorRoteiro(@PathVariable Integer roteiroId) {
        return service.listarPorRoteiro(roteiroId);
    }
}
