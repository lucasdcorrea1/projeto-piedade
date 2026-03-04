package com.ccb.piedade.controller;

import com.ccb.piedade.dto.ApiResponse;
import com.ccb.piedade.dto.DashboardResumoDTO;
import com.ccb.piedade.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Dados consolidados para o painel de controle")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumo")
    @Operation(summary = "Resumo do dashboard", description = "Retorna totais de fieis, doacoes e entregas do mes, e itens proximos do vencimento")
    public ResponseEntity<ApiResponse<DashboardResumoDTO>> getResumo() {
        DashboardResumoDTO resumo = dashboardService.getResumo();
        return ResponseEntity.ok(ApiResponse.ok(resumo));
    }

    @GetMapping("/entregas-por-bairro")
    @Operation(summary = "Entregas por bairro", description = "Retorna quantidade de entregas agrupadas por bairro do fiel")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getEntregasPorBairro() {
        Map<String, Long> dados = dashboardService.getEntregasPorBairro();
        return ResponseEntity.ok(ApiResponse.ok(dados));
    }

    @GetMapping("/doacoes-por-periodo")
    @Operation(summary = "Doacoes por periodo", description = "Retorna quantidade de doacoes agrupadas por mes/ano dentro de um periodo")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDoacoesPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        Map<String, Long> dados = dashboardService.getDoacoesPorPeriodo(inicio, fim);
        return ResponseEntity.ok(ApiResponse.ok(dados));
    }

    @GetMapping("/itens-mais-doados")
    @Operation(summary = "Itens mais doados", description = "Retorna os 10 itens com maior quantidade total doada")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getItensMaisDoados() {
        List<Map<String, Object>> dados = dashboardService.getItensMaisDoados();
        return ResponseEntity.ok(ApiResponse.ok(dados));
    }

    @GetMapping("/estoque")
    @Operation(summary = "Estoque atual", description = "Calcula o saldo de estoque (doacoes - entregas) por item")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getEstoque() {
        List<Map<String, Object>> dados = dashboardService.getEstoque();
        return ResponseEntity.ok(ApiResponse.ok(dados));
    }
}
