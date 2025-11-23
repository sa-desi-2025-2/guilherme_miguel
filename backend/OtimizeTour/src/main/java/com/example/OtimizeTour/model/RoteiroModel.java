package com.example.OtimizeTour.model;

import jakarta.persistence.*;
import java.time.LocalDate;

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

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioModel usuario;

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


    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }

    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public float getCustoTotal() { return custoTotal; }
    public void setCustoTotal(float custoTotal) { this.custoTotal = custoTotal; }

    public UsuarioModel getUsuario() { return usuario; }
    public void setUsuario(UsuarioModel usuario) { this.usuario = usuario; }
}
