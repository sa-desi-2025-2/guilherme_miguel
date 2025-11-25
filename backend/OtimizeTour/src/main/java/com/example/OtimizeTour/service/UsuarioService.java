package com.example.OtimizeTour.service;

import com.example.OtimizeTour.model.UsuarioModel;
import com.example.OtimizeTour.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioModel> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<UsuarioModel> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Optional<UsuarioModel> buscarPorEmail(String email) {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public UsuarioModel salvar(UsuarioModel usuario) {
        String senhaPura = usuario.getSenhaHash();
        usuario.setSenhaHash(gerarHashSHA512(senhaPura));
        return usuarioRepository.save(usuario);
    }

    public UsuarioModel atualizar(Integer id, UsuarioModel usuarioAtualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setEmail(usuarioAtualizado.getEmail());

                    if (usuarioAtualizado.getSenhaHash() != null && !usuarioAtualizado.getSenhaHash().isEmpty()) {
                        usuario.setSenhaHash(gerarHashSHA512(usuarioAtualizado.getSenhaHash()));
                    }

                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public void deletar(Integer id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
        } else {
            throw new RuntimeException("Usuário não encontrado");
        }
    }

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
}
