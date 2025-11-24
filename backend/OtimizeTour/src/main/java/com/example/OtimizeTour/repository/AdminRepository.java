package com.example.OtimizeTour.repository;

import com.example.OtimizeTour.model.AdminModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para operações de CRUD da entidade Admin.
 */
@Repository
public interface AdminRepository extends JpaRepository<AdminModel, Integer> {

    Optional<AdminModel> findByEmail(String email);
}