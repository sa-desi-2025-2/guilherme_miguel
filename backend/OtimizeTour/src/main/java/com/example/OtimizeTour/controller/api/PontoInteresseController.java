package com.example.OtimizeTour.controller.api;
import com.example.OtimizeTour.model.PontoInteresseModal;
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
    public List<PontoInteresseModal> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PontoInteresseModal buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public PontoInteresseModal criar(@RequestBody PontoInteresseModal ponto) {
        return service.salvar(ponto);
    }

    @PutMapping("/{id}")
    public PontoInteresseModal atualizar(@PathVariable Integer id, @RequestBody PontoInteresseModal ponto) {
        return service.atualizar(id, ponto);
    }

    @DeleteMapping("/{id}")
    public boolean excluir(@PathVariable Integer id) {
        return service.excluir(id);
    }

    @PostMapping("/{id}/avaliar")
    public PontoInteresseModal avaliar(@PathVariable Integer id, @RequestParam float valor) {
        return service.avaliar(id, valor);
    }
}
