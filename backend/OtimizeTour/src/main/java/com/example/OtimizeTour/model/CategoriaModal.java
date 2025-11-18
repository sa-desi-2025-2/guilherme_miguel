package com.example.OtimizeTour.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categorias")
public class CategoriaModal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private Integer id;
    private String nome;

    public CategoriaModal() {}

    public CategoriaModal(String nome) {
        this.nome = nome;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
