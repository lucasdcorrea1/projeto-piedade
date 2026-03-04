package com.ccb.piedade.dto;

import com.ccb.piedade.model.ItemDoacao;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoacaoDTO {

    private String id;

    @NotNull(message = "Data e obrigatoria")
    private LocalDate data;

    @NotEmpty(message = "Lista de itens nao pode ser vazia")
    private List<ItemDoacao> itens;

    private String origem;

    private String observacoes;

    private String registradoPor;

    private LocalDateTime criadoEm;
}
