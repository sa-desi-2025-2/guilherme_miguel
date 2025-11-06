package com.example.OtimizeTour.service;

import com.example.OtimizeTour.model.UsuarioModel;
import com.example.OtimizeTour.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                  .filter(usuario -> usuario.getEmail().equalsIgnoreCase(email))
                  .findFirst();
      }
      

    public UsuarioModel salvar(UsuarioModel usuario) {
        return usuarioRepository.save(usuario);
    }

    public UsuarioModel atualizar(Integer id, UsuarioModel usuarioAtualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    usuario.setSenhaHash(usuarioAtualizado.getSenhaHash());
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    public void deletar(Integer id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
        } else {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
    }
}
