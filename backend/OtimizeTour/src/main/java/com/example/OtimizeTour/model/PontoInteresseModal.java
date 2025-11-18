package com.example.OtimizeTour.model;

import jakarta.persistence.*;

@Entity
public class PontoInteresseModal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String descricao;

    private float avaliacaoMedia;

    public PontoInteresseModal() {}

    public PontoInteresseModal(String nome, String descricao, float avaliacaoMedia) {
        this.nome = nome;
        this.descricao = descricao;
        this.avaliacaoMedia = avaliacaoMedia;
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public float getAvaliacaoMedia() {
        return avaliacaoMedia;
    }

    public void setAvaliacaoMedia(float avaliacaoMedia) {
        this.avaliacaoMedia = avaliacaoMedia;
    }

    // Método do UML
    public void avaliar(float avaliacao) {
        this.avaliacaoMedia = avaliacao;
    }
}
