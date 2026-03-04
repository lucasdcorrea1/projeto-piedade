package com.ccb.piedade.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDoacao {

    private String itemId;
    private String nomeItem;
    private Double quantidade;
    private LocalDate validade;
}
