package com.example.OtimizeTour.service;

import com.example.OtimizeTour.model.CategoriaModel;
import com.example.OtimizeTour.model.RoteiroModel;
import com.example.OtimizeTour.model.PontoInteresseModel;
import com.example.OtimizeTour.repository.PontoInteresseRepository;
import com.example.OtimizeTour.service.CategoriaService;
import com.example.OtimizeTour.service.RoteiroService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PontoInteresseService {

    private final PontoInteresseRepository repository;
    private final CategoriaService categoriaService;
    private final RoteiroService roteiroService;

    public PontoInteresseService(PontoInteresseRepository repository, CategoriaService categoriaService, RoteiroService roteiroService) {
        this.repository = repository;
        this.categoriaService = categoriaService;
        this.roteiroService = roteiroService;
    }

    public List<PontoInteresseModel> listar() {
        return repository.findAll();
    }

    public List<PontoInteresseModel> listarPorRoteiro(Integer roteiroId) {
        return repository.findByRoteiroId(roteiroId);
    }


    public PontoInteresseModel buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public PontoInteresseModel salvar(PontoInteresseModel ponto) {
        validarCoordenadas(ponto);
        return repository.save(ponto);
    }

    public PontoInteresseModel salvarComCategoria(PontoInteresseModel ponto, Integer categoriaId, Integer roteiroId) {
        CategoriaModel categoria = categoriaService.buscarPorId(categoriaId);
        RoteiroModel roteiro = roteiroService.buscarPorId(roteiroId);
        ponto.setCategoria(categoria);
        ponto.setRoteiro(roteiro);
        validarCoordenadas(ponto);
        return repository.save(ponto);
    }

    public PontoInteresseModel atualizar(Integer id, PontoInteresseModel novoPonto) {
        return repository.findById(id).map(p -> {

            p.setNome(novoPonto.getNome());
            p.setDescricao(novoPonto.getDescricao());
            p.setAvaliacaoMedia(novoPonto.getAvaliacaoMedia());
            p.setCategoria(novoPonto.getCategoria());
            p.setRoteiro(novoPonto.getRoteiro());

            // 🔥 Adicionado agora:
            p.setLatitude(novoPonto.getLatitude());
            p.setLongitude(novoPonto.getLongitude());

            validarCoordenadas(p);

            return repository.save(p);

        }).orElse(null);
    }

    public boolean excluir(Integer id) {
        return repository.findById(id).map(p -> {
            repository.delete(p);
            return true;
        }).orElse(false);
    }

    public PontoInteresseModel avaliar(Integer id, float avaliacao) {
        return repository.findById(id).map(p -> {
            p.avaliar(avaliacao);
            return repository.save(p);
        }).orElse(null);
    }

    // ---------------------------
    // 🔍 Validação de Coordenadas
    // ---------------------------
    private void validarCoordenadas(PontoInteresseModel ponto) {

        if (ponto.getLatitude() < -90 || ponto.getLatitude() > 90) {
            throw new IllegalArgumentException("Latitude inválida: deve estar entre -90 e 90.");
        }

        if (ponto.getLongitude() < -180 || ponto.getLongitude() > 180) {
            throw new IllegalArgumentException("Longitude inválida: deve estar entre -180 e 180.");
        }
    }
}
