package com.example.OtimizeTour.controller.api;

import com.example.OtimizeTour.dto.LoginDTO;
import com.example.OtimizeTour.model.AdminModel;
import com.example.OtimizeTour.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminModel>> listarTodos() {
        return ResponseEntity.ok(adminService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminModel> buscarPorId(@PathVariable Integer id) {
        return adminService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AdminModel> buscarPorEmail(@PathVariable String email) {
        return adminService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AdminModel> criar(@RequestBody AdminModel admin) {
        return ResponseEntity.ok(adminService.salvar(admin));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {

        Optional<AdminModel> adminOpt = adminService.buscarPorEmail(loginDTO.getEmail());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Credenciais de Admin incorretas.");
        }

        AdminModel admin = adminOpt.get();

        String hashDigitado = adminService.gerarHashSHA512(loginDTO.getSenha());

        if (!hashDigitado.equals(admin.getSenhaHash())) {
            return ResponseEntity.status(401).body("Credenciais de Admin incorretas.");
        }

        return ResponseEntity.ok(admin);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminModel> atualizar(@PathVariable Integer id, @RequestBody AdminModel adminAtualizado) {
        try {
            return ResponseEntity.ok(adminService.atualizar(id, adminAtualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

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