package com.ccb.piedade.repository;

import com.ccb.piedade.model.Doacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoacaoRepository extends MongoRepository<Doacao, String> {

    List<Doacao> findByDataBetween(LocalDate inicio, LocalDate fim);

    Page<Doacao> findAll(Pageable pageable);

    Page<Doacao> findByDataBetween(LocalDate inicio, LocalDate fim, Pageable pageable);

    List<Doacao> findByOrigem(String origem);

    long countByDataBetween(LocalDate inicio, LocalDate fim);
}
