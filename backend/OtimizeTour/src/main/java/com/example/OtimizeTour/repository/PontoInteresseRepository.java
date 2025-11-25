package com.example.OtimizeTour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.OtimizeTour.model.PontoInteresseModel;
import java.util.List;

public interface PontoInteresseRepository extends JpaRepository<PontoInteresseModel, Integer> {

    List<PontoInteresseModel> findByRoteiroId(Integer roteiroId);

}
