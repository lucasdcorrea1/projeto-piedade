package com.ccb.piedade.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "fieis")
public class Fiel {

    @Id
    private String id;

    private String nome;

    @Indexed(unique = true, sparse = true)
    private String cpf;

    private String telefone;

    private Endereco endereco;

    private String congregacao;

    private String observacoes;

    @Builder.Default
    private Boolean ativo = true;

    @CreatedDate
    private LocalDateTime criadoEm;

    @LastModifiedDate
    private LocalDateTime atualizadoEm;
}
