package com.ccb.piedade.dto;

import com.ccb.piedade.model.enums.CategoriaItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {

    private String id;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    private String descricao;

    @NotNull(message = "Categoria e obrigatoria")
    private CategoriaItem categoria;

    @NotBlank(message = "Unidade de medida e obrigatoria")
    private String unidadeMedida;

    private Boolean ativo;
}
