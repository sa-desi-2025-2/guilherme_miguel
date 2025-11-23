package com.example.OtimizeTour.controller.api;

import com.example.OtimizeTour.model.RoteiroModel;
import com.example.OtimizeTour.service.RoteiroService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roteiros")
public class RoteiroController {

    private final RoteiroService service;

    public RoteiroController(RoteiroService service) {
        this.service = service;
    }

    @GetMapping
    public List<RoteiroModel> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public RoteiroModel buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public RoteiroModel salvar(@RequestBody RoteiroModel roteiro) {
        return service.salvar(roteiro);
    }

    @PutMapping("/{id}")
    public RoteiroModel atualizar(@PathVariable Integer id, @RequestBody RoteiroModel novoRoteiro) {
        RoteiroModel antigo = service.buscarPorId(id);

        if (antigo == null) return null;
        antigo.setPais(novoRoteiro.getPais());
        antigo.setDestino(novoRoteiro.getDestino());
        antigo.setDataInicio(novoRoteiro.getDataInicio());
        antigo.setDataFim(novoRoteiro.getDataFim());
        antigo.setCustoTotal(novoRoteiro.getCustoTotal());
        antigo.setUsuario(novoRoteiro.getUsuario());

        return service.salvar(antigo);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        service.deletar(id);
    }
}
