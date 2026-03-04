package com.ccb.piedade.repository;

import com.ccb.piedade.model.Entrega;
import com.ccb.piedade.model.enums.StatusEntrega;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EntregaRepository extends MongoRepository<Entrega, String> {

    List<Entrega> findByFielId(String fielId);

    List<Entrega> findByStatus(StatusEntrega status);

    List<Entrega> findByDataBetween(LocalDate inicio, LocalDate fim);

    Page<Entrega> findAll(Pageable pageable);

    Page<Entrega> findByFielId(String fielId, Pageable pageable);

    Page<Entrega> findByStatus(StatusEntrega status, Pageable pageable);

    Page<Entrega> findByDataBetween(LocalDate inicio, LocalDate fim, Pageable pageable);

    long countByDataBetween(LocalDate inicio, LocalDate fim);
}
