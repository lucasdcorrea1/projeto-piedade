package com.ccb.piedade.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemEntrega {

    private String itemId;
    private String nomeItem;
    private Double quantidade;
}
