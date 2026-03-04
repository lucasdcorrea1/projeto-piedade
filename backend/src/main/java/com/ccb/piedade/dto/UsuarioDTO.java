package com.ccb.piedade.dto;

import com.ccb.piedade.model.enums.Perfil;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {

    private String id;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

    @NotNull(message = "Perfil e obrigatorio")
    private Perfil perfil;

    private String congregacao;

    private Boolean ativo;

    private LocalDateTime criadoEm;

    private LocalDateTime atualizadoEm;
}
