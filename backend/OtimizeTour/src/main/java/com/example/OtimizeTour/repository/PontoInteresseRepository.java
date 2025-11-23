package com.example.OtimizeTour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.OtimizeTour.model.PontoInteresseModel;
import java.util.List;

public interface PontoInteresseRepository extends JpaRepository<PontoInteresseModel, Integer> {

    // 🔍 Buscar todos os pontos por ID do roteiro
    List<PontoInteresseModel> findByRoteiroId(Integer roteiroId);

}
