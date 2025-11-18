package com.example.OtimizeTour.model;
import com.example.OtimizeTour.model.CategoriaModel;

import jakarta.persistence.*;

@Entity
@Table(name = "pontosinteresse")
public class PontoInteresseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String descricao;
    private float avaliacaoMedia;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private CategoriaModel categoria;

    public PontoInteresseModel() {}

    public PontoInteresseModel(String nome, String descricao, float avaliacaoMedia) {
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

    public CategoriaModel getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaModel categoria) {
        this.categoria = categoria;
    }

    public void avaliar(float avaliacao) {
        this.avaliacaoMedia = avaliacao;
    }
}
