package com.example.OtimizeTour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.OtimizeTour.model.CategoriaModel;

public interface CategoriaRepository extends JpaRepository<CategoriaModel, Integer> {
}
