package com.ccb.piedade.controller;

import com.ccb.piedade.dto.ApiResponse;
import com.ccb.piedade.dto.EntregaDTO;
import com.ccb.piedade.dto.StatusUpdateDTO;
import com.ccb.piedade.model.enums.StatusEntrega;
import com.ccb.piedade.service.EntregaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/entregas")
@Tag(name = "Entregas", description = "Gerenciamento de entregas de doacoes aos fieis")
public class EntregaController {

    private final EntregaService entregaService;

    public EntregaController(EntregaService entregaService) {
        this.entregaService = entregaService;
    }

    @PostMapping
    @Operation(summary = "Registrar entrega", description = "Registra uma nova entrega de doacao a um fiel")
    public ResponseEntity<ApiResponse<EntregaDTO>> criar(@Valid @RequestBody EntregaDTO dto) {
        EntregaDTO criado = entregaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Entrega registrada com sucesso", criado));
    }

    @GetMapping
    @Operation(summary = "Listar entregas", description = "Lista entregas com paginacao")
    public ResponseEntity<ApiResponse<Page<EntregaDTO>>> listar(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EntregaDTO> page = entregaService.listarTodas(pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar entrega por ID", description = "Retorna uma entrega pelo ID")
    public ResponseEntity<ApiResponse<EntregaDTO>> buscarPorId(@PathVariable String id) {
        EntregaDTO dto = entregaService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/fiel/{fielId}")
    @Operation(summary = "Buscar entregas por fiel", description = "Filtra entregas pelo ID do fiel")
    public ResponseEntity<ApiResponse<List<EntregaDTO>>> buscarPorFiel(@PathVariable String fielId) {
        List<EntregaDTO> entregas = entregaService.buscarPorFiel(fielId);
        return ResponseEntity.ok(ApiResponse.ok(entregas));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Buscar entregas por status", description = "Filtra entregas por status")
    public ResponseEntity<ApiResponse<List<EntregaDTO>>> buscarPorStatus(@PathVariable StatusEntrega status) {
        List<EntregaDTO> entregas = entregaService.buscarPorStatus(status);
        return ResponseEntity.ok(ApiResponse.ok(entregas));
    }

    @GetMapping("/periodo")
    @Operation(summary = "Buscar entregas por periodo", description = "Filtra entregas por data de inicio e fim")
    public ResponseEntity<ApiResponse<List<EntregaDTO>>> buscarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        List<EntregaDTO> entregas = entregaService.buscarPorPeriodo(inicio, fim);
        return ResponseEntity.ok(ApiResponse.ok(entregas));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar entrega", description = "Atualiza os dados de uma entrega")
    public ResponseEntity<ApiResponse<EntregaDTO>> atualizar(
            @PathVariable String id,
            @Valid @RequestBody EntregaDTO dto) {
        EntregaDTO atualizado = entregaService.atualizar(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Entrega atualizada com sucesso", atualizado));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status da entrega", description = "Altera o status de uma entrega (PENDENTE, ENTREGUE, CANCELADA)")
    public ResponseEntity<ApiResponse<EntregaDTO>> atualizarStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateDTO statusUpdate) {
        EntregaDTO atualizado = entregaService.atualizarStatus(id, statusUpdate.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Status atualizado com sucesso", atualizado));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover entrega", description = "Remove uma entrega permanentemente")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable String id) {
        entregaService.deletar(id);
        return ResponseEntity.ok(ApiResponse.ok("Entrega removida com sucesso"));
    }
}
