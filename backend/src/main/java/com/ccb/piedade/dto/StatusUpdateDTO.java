package com.ccb.piedade.dto;

import com.ccb.piedade.model.enums.StatusEntrega;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateDTO {

    @NotNull(message = "Status e obrigatorio")
    private StatusEntrega status;
}
