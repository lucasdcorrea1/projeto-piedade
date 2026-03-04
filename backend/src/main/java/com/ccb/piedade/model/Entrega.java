package com.ccb.piedade.model;

import com.ccb.piedade.model.enums.StatusEntrega;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "entregas")
public class Entrega {

    @Id
    private String id;

    private String fielId;

    private String nomeFiel;

    private LocalDate data;

    private List<ItemEntrega> itens;

    @Builder.Default
    private StatusEntrega status = StatusEntrega.PENDENTE;

    private String observacoes;

    private String registradoPor;

    private LocalDateTime entregueEm;

    @CreatedDate
    private LocalDateTime criadoEm;
}
