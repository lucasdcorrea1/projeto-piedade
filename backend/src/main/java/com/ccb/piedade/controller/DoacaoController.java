package com.ccb.piedade.controller;

import com.ccb.piedade.dto.ApiResponse;
import com.ccb.piedade.dto.DoacaoDTO;
import com.ccb.piedade.service.DoacaoService;
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
@RequestMapping("/api/doacoes")
@Tag(name = "Doacoes", description = "Gerenciamento de doacoes recebidas")
public class DoacaoController {

    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @PostMapping
    @Operation(summary = "Registrar doacao", description = "Registra uma nova doacao")
    public ResponseEntity<ApiResponse<DoacaoDTO>> criar(@Valid @RequestBody DoacaoDTO dto) {
        DoacaoDTO criado = doacaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Doacao registrada com sucesso", criado));
    }

    @GetMapping
    @Operation(summary = "Listar doacoes", description = "Lista doacoes com paginacao")
    public ResponseEntity<ApiResponse<Page<DoacaoDTO>>> listar(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<DoacaoDTO> page = doacaoService.listarTodas(pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar doacao por ID", description = "Retorna uma doacao pelo ID")
    public ResponseEntity<ApiResponse<DoacaoDTO>> buscarPorId(@PathVariable String id) {
        DoacaoDTO dto = doacaoService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/periodo")
    @Operation(summary = "Buscar doacoes por periodo", description = "Filtra doacoes por data de inicio e fim")
    public ResponseEntity<ApiResponse<List<DoacaoDTO>>> buscarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        List<DoacaoDTO> doacoes = doacaoService.buscarPorPeriodo(inicio, fim);
        return ResponseEntity.ok(ApiResponse.ok(doacoes));
    }

    @GetMapping("/origem/{origem}")
    @Operation(summary = "Buscar doacoes por origem", description = "Filtra doacoes por origem")
    public ResponseEntity<ApiResponse<List<DoacaoDTO>>> buscarPorOrigem(@PathVariable String origem) {
        List<DoacaoDTO> doacoes = doacaoService.buscarPorOrigem(origem);
        return ResponseEntity.ok(ApiResponse.ok(doacoes));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar doacao", description = "Atualiza os dados de uma doacao")
    public ResponseEntity<ApiResponse<DoacaoDTO>> atualizar(
            @PathVariable String id,
            @Valid @RequestBody DoacaoDTO dto) {
        DoacaoDTO atualizado = doacaoService.atualizar(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Doacao atualizada com sucesso", atualizado));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover doacao", description = "Remove uma doacao permanentemente")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable String id) {
        doacaoService.deletar(id);
        return ResponseEntity.ok(ApiResponse.ok("Doacao removida com sucesso"));
    }
}
