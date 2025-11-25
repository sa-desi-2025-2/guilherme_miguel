package com.example.OtimizeTour.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;

@Entity
@Table(name = "roteiros")
public class RoteiroModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String pais;
    private String destino;

    private LocalDate dataInicio;
    private LocalDate dataFim;

    private float custoTotal;

    @Column(unique = true)
    private String shareToken;  

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioModel usuario;

    @OneToMany(mappedBy = "roteiro", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PontoInteresseModel> pontos = new ArrayList<>();

    public RoteiroModel() {}

    public RoteiroModel(Integer id, String pais, String destino, LocalDate dataInicio, LocalDate dataFim, float custoTotal, UsuarioModel usuario) {
        this.id = id;
        this.pais = pais;
        this.destino = destino;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.custoTotal = custoTotal;
        this.usuario = usuario;
    }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }

    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio;}

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public float getCustoTotal() { return custoTotal; }
    public void setCustoTotal(float custoTotal) { this.custoTotal = custoTotal; }

    public UsuarioModel getUsuario() { return usuario; }
    public void setUsuario(UsuarioModel usuario) { this.usuario = usuario; }
        
    public List<PontoInteresseModel> getPontos() { return pontos; }
    public void setPontos(List<PontoInteresseModel> pontos) { this.pontos = pontos; }
}   