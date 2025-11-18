package com.example.OtimizeTour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.OtimizeTour.model.CategoriaModal;

public interface CategoriaRepository extends JpaRepository<CategoriaModal, Integer> {
}
