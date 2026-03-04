package com.ccb.piedade.dto;

import com.ccb.piedade.model.ItemEntrega;
import com.ccb.piedade.model.enums.StatusEntrega;
import jakarta.validation.constraints.NotBlank;
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
public class EntregaDTO {

    private String id;

    @NotBlank(message = "ID do fiel e obrigatorio")
    private String fielId;

    private String nomeFiel;

    @NotNull(message = "Data e obrigatoria")
    private LocalDate data;

    @NotEmpty(message = "Lista de itens nao pode ser vazia")
    private List<ItemEntrega> itens;

    private StatusEntrega status;

    private String observacoes;

    private String registradoPor;

    private LocalDateTime entregueEm;

    private LocalDateTime criadoEm;
}
