package com.example.OtimizeTour.dto;

public class PontoInteresseDTO {
    private String titulo;
    private String descricao;
    private Double lat;
    private Double lon;
    private Float avaliacaoMedia;
    private Integer categoriaId; 

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLon() { return lon; }
    public void setLon(Double lon) { this.lon = lon; }

    public Float getAvaliacaoMedia() { return avaliacaoMedia; }
    public void setAvaliacaoMedia(Float avaliacaoMedia) { this.avaliacaoMedia = avaliacaoMedia; }

    public Integer getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Integer categoriaId) { this.categoriaId = categoriaId; }
}
