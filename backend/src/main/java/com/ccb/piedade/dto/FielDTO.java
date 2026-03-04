package com.ccb.piedade.dto;

import com.ccb.piedade.model.Endereco;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FielDTO {

    private String id;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    private String cpf;

    private String telefone;

    private Endereco endereco;

    private String congregacao;

    private String observacoes;

    private Boolean ativo;

    private LocalDateTime criadoEm;

    private LocalDateTime atualizadoEm;
}
