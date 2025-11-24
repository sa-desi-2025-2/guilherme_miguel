package com.example.OtimizeTour.model;

import jakarta.persistence.*;

/**
 * Entidade que representa um Administrador no sistema,
 * mapeada para a tabela 'admin' do banco de dados.
 */
@Entity
@Table(name = "admin")
public class AdminModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    private String email;

    // Coluna para armazenar o hash SHA-512 da senha
    @Column(nullable = false)
    private String senhaHash;

    public AdminModel() {}

    // Getters
    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    // Setters
    public void setId(Integer id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }
}