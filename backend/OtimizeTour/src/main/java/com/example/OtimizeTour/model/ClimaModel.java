package com.example.OtimizeTour.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clima")
public class ClimaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String climaAtual;

    @ManyToOne
    @JoinColumn(name = "roteiro_id")
    private RoteiroModel roteiro;

    public ClimaModel() {}

    public ClimaModel(String climaAtual, RoteiroModel roteiro) {
        this.climaAtual = climaAtual;
        this.roteiro = roteiro;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getClimaAtual() {
        return climaAtual;
    }

    public void setClimaAtual(String climaAtual) {
        this.climaAtual = climaAtual;
    }

    public RoteiroModel getRoteiro() {
        return roteiro;
    }

    public void setRoteiro(RoteiroModel roteiro) {
        this.roteiro = roteiro;
    }
}
