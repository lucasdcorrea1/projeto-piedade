package com.ccb.piedade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResumoDTO {

    private long totalFieis;
    private long totalDoacoesMes;
    private long totalEntregasMes;
    private long itensProximosVencimento;
}
