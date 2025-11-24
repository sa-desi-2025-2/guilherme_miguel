package com.example.OtimizeTour.controller.api;

import com.example.OtimizeTour.model.ClimaModel;
import com.example.OtimizeTour.service.ClimaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clima")
public class ClimaController {

    private final ClimaService service;

    public ClimaController(ClimaService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClimaModel> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ClimaModel buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ClimaModel criar(@RequestBody ClimaModel clima) {
        return service.salvar(clima);
    }

    @PostMapping("/roteiro/{roteiroId}")
    public ClimaModel criarComRoteiro(
            @PathVariable Integer roteiroId,
            @RequestBody ClimaModel clima) {
        return service.salvarComRoteiro(clima, roteiroId);
    }

    @PutMapping("/{id}")
    public ClimaModel atualizar(@PathVariable Integer id, @RequestBody ClimaModel clima) {
        return service.atualizar(id, clima);
    }

    @DeleteMapping("/{id}")
    public boolean excluir(@PathVariable Integer id) {
        return service.excluir(id);
    }
}
