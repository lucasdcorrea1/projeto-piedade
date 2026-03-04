package com.ccb.piedade.repository;

import com.ccb.piedade.model.Fiel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FielRepository extends MongoRepository<Fiel, String> {

    Page<Fiel> findByAtivoTrue(Pageable pageable);

    List<Fiel> findByAtivoTrue();

    Page<Fiel> findByNomeContainingIgnoreCaseAndAtivoTrue(String nome, Pageable pageable);

    List<Fiel> findByEnderecoBairroContainingIgnoreCaseAndAtivoTrue(String bairro);

    List<Fiel> findByEnderecoCidadeContainingIgnoreCaseAndAtivoTrue(String cidade);

    long countByAtivoTrue();
}
