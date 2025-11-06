package com.example.OtimizeTour.controller.api;

import com.example.OtimizeTour.model.UsuarioModel;
import com.example.OtimizeTour.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    //Listar todos os usuários
    @GetMapping
    public ResponseEntity<List<UsuarioModel>> listarTodos() {
        List<UsuarioModel> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    //Buscar Usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioModel> buscarPorId(@PathVariable Integer id) {
        Optional<UsuarioModel> usuario = usuarioService.buscarPorId(id);
        return usuario.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    //Buscar Usuario por e-mail
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioModel> buscarPorEmail(@PathVariable String email) {
        Optional<UsuarioModel> usuario = usuarioService.buscarPorEmail(email);
        return usuario.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    //Criar novo usuário
    @PostMapping
    public ResponseEntity<UsuarioModel> criar(@RequestBody UsuarioModel usuario) {
          UsuarioModel novoUsuario = usuarioService.salvar(usuario);
        return ResponseEntity.ok(novoUsuario);
    }

    //Atualizar usuário existente
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioModel> atualizar(@PathVariable Integer id, @RequestBody UsuarioModel usuarioAtualizado) {
        try {
            UsuarioModel usuario = usuarioService.atualizar(id, usuarioAtualizado);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Deletar usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        try {
            usuarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
