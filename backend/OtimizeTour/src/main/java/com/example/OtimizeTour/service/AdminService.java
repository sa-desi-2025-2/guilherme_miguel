package com.example.OtimizeTour.service;

import com.example.OtimizeTour.model.AdminModel;
import com.example.OtimizeTour.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;


@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;


    public String gerarHashSHA512(String senha) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            byte[] hashBytes = md.digest(senha.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash SHA-512", e);
        }
    }

    public List<AdminModel> listarTodos() {
        return adminRepository.findAll();
    }

    public Optional<AdminModel> buscarPorId(Integer id) {
        return adminRepository.findById(id);
    }

    public Optional<AdminModel> buscarPorEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public AdminModel salvar(AdminModel admin) {
        String senhaPura = admin.getSenhaHash();
        admin.setSenhaHash(gerarHashSHA512(senhaPura));
        return adminRepository.save(admin);
    }

    public AdminModel atualizar(Integer id, AdminModel adminAtualizado) {
        return adminRepository.findById(id)
                .map(admin -> {
                    admin.setNome(adminAtualizado.getNome());
                    admin.setEmail(adminAtualizado.getEmail());

                    if (adminAtualizado.getSenhaHash() != null && !adminAtualizado.getSenhaHash().isEmpty()) {
                        admin.setSenhaHash(gerarHashSHA512(adminAtualizado.getSenhaHash()));
                    }

                    return adminRepository.save(admin);
                })
                .orElseThrow(() -> new RuntimeException("Admin não encontrado"));
    }

    public void deletar(Integer id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
        } else {
            throw new RuntimeException("Admin não encontrado");
        }
    }
}