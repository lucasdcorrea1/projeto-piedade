package com.ccb.piedade.model;

import com.ccb.piedade.model.enums.CategoriaItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "itens")
public class Item {

    @Id
    private String id;

    private String nome;

    private String descricao;

    private CategoriaItem categoria;

    private String unidadeMedida;

    @Builder.Default
    private Boolean ativo = true;
}
