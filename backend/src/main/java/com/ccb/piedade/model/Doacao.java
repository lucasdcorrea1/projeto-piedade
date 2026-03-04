package com.ccb.piedade.model;

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
@Document(collection = "doacoes")
public class Doacao {

    @Id
    private String id;

    private LocalDate data;

    private List<ItemDoacao> itens;

    private String origem;

    private String observacoes;

    private String registradoPor;

    @CreatedDate
    private LocalDateTime criadoEm;
}
