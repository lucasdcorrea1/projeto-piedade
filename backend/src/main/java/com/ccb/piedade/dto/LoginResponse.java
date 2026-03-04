package com.ccb.piedade.dto;

import com.ccb.piedade.model.enums.Perfil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String nome;
    private String email;
    private Perfil perfil;
}
