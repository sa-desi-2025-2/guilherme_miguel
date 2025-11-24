package com.example.OtimizeTour.controller.api;

import com.example.OtimizeTour.dto.LoginDTO;
import com.example.OtimizeTour.model.AdminModel;
import com.example.OtimizeTour.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller REST para a entidade Admin.
 * Endpoints: /admins
 */
@RestController
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // GET /admins
    @GetMapping
    public ResponseEntity<List<AdminModel>> listarTodos() {
        return ResponseEntity.ok(adminService.listarTodos());
    }

    // GET /admins/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AdminModel> buscarPorId(@PathVariable Integer id) {
        return adminService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /admins/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<AdminModel> buscarPorEmail(@PathVariable String email) {
        return adminService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /admins (Criação de novo admin)
    @PostMapping
    public ResponseEntity<AdminModel> criar(@RequestBody AdminModel admin) {
        // Retorna 200 OK após salvar (status 201 Created seria mais RESTful, mas seguindo o padrão do UsuarioController)
        return ResponseEntity.ok(adminService.salvar(admin));
    }

    // POST /admins/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {

        Optional<AdminModel> adminOpt = adminService.buscarPorEmail(loginDTO.getEmail());
        if (adminOpt.isEmpty()) {
            // Email não encontrado
            return ResponseEntity.status(401).body("Credenciais de Admin incorretas.");
        }

        AdminModel admin = adminOpt.get();

        // Gera o hash da senha digitada pelo usuário
        String hashDigitado = adminService.gerarHashSHA512(loginDTO.getSenha());

        // Compara os hashes
        if (!hashDigitado.equals(admin.getSenhaHash())) {
            // Senha incorreta
            return ResponseEntity.status(401).body("Credenciais de Admin incorretas.");
        }

        // Login bem-sucedido
        return ResponseEntity.ok(admin);
    }

    // PUT /admins/{id}
    @PutMapping("/{id}")
    public ResponseEntity<AdminModel> atualizar(@PathVariable Integer id, @RequestBody AdminModel adminAtualizado) {
        try {
            return ResponseEntity.ok(adminService.atualizar(id, adminAtualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /admins/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        try {
            adminService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}