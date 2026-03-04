package com.ccb.piedade.controller;

import com.ccb.piedade.dto.ApiResponse;
import com.ccb.piedade.dto.EntregaDTO;
import com.ccb.piedade.dto.FielDTO;
import com.ccb.piedade.service.FielService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

import java.util.List;

@RestController
@RequestMapping("/api/fieis")
@Tag(name = "Fieis", description = "Gerenciamento de fieis")
public class FielController {

    private final FielService fielService;

    public FielController(FielService fielService) {
        this.fielService = fielService;
    }

    @PostMapping
    @Operation(summary = "Cadastrar fiel", description = "Cria um novo cadastro de fiel")
    public ResponseEntity<ApiResponse<FielDTO>> criar(@Valid @RequestBody FielDTO dto) {
        FielDTO criado = fielService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Fiel cadastrado com sucesso", criado));
    }

    @GetMapping
    @Operation(summary = "Listar fieis", description = "Lista fieis ativos com paginacao e filtro por nome, bairro ou cidade")
    public ResponseEntity<ApiResponse<Page<FielDTO>>> listar(
            @Parameter(description = "Filtrar por nome do fiel")
            @RequestParam(required = false) String nome,
            @Parameter(description = "Filtrar por bairro do endereco")
            @RequestParam(required = false) String bairro,
            @Parameter(description = "Filtrar por cidade do endereco")
            @RequestParam(required = false) String cidade,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<FielDTO> page;
        if (nome != null && !nome.isBlank()) {
            page = fielService.buscarPorNome(nome, pageable);
        } else if (bairro != null && !bairro.isBlank()) {
            List<FielDTO> fieis = fielService.buscarPorBairro(bairro);
            return ResponseEntity.ok(ApiResponse.ok(toPage(fieis, pageable)));
        } else if (cidade != null && !cidade.isBlank()) {
            List<FielDTO> fieis = fielService.buscarPorCidade(cidade);
            return ResponseEntity.ok(ApiResponse.ok(toPage(fieis, pageable)));
        } else {
            page = fielService.listarAtivos(pageable);
        }
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar fiel por ID", description = "Retorna os dados de um fiel pelo ID")
    public ResponseEntity<ApiResponse<FielDTO>> buscarPorId(@PathVariable String id) {
        FielDTO dto = fielService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/bairro/{bairro}")
    @Operation(summary = "Buscar fieis por bairro", description = "Retorna fieis ativos de um determinado bairro")
    public ResponseEntity<ApiResponse<List<FielDTO>>> buscarPorBairro(@PathVariable String bairro) {
        List<FielDTO> fieis = fielService.buscarPorBairro(bairro);
        return ResponseEntity.ok(ApiResponse.ok(fieis));
    }

    @GetMapping("/cidade/{cidade}")
    @Operation(summary = "Buscar fieis por cidade", description = "Retorna fieis ativos de uma determinada cidade")
    public ResponseEntity<ApiResponse<List<FielDTO>>> buscarPorCidade(@PathVariable String cidade) {
        List<FielDTO> fieis = fielService.buscarPorCidade(cidade);
        return ResponseEntity.ok(ApiResponse.ok(fieis));
    }

    @GetMapping("/{id}/historico")
    @Operation(summary = "Historico de entregas do fiel", description = "Retorna todas as entregas feitas a um fiel")
    public ResponseEntity<ApiResponse<List<EntregaDTO>>> getHistorico(@PathVariable String id) {
        List<EntregaDTO> historico = fielService.getHistoricoEntregas(id);
        return ResponseEntity.ok(ApiResponse.ok(historico));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar fiel", description = "Atualiza os dados de um fiel")
    public ResponseEntity<ApiResponse<FielDTO>> atualizar(
            @PathVariable String id,
            @Valid @RequestBody FielDTO dto) {
        FielDTO atualizado = fielService.atualizar(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Fiel atualizado com sucesso", atualizado));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover fiel", description = "Desativa um fiel (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable String id) {
        fielService.deletar(id);
        return ResponseEntity.ok(ApiResponse.ok("Fiel removido com sucesso"));
    }

    /**
     * Converte uma lista em uma Page manual para manter a interface consistente
     * quando o filtro retorna List em vez de Page.
     */
    private Page<FielDTO> toPage(List<FielDTO> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), list.size());

        if (start > list.size()) {
            return new org.springframework.data.domain.PageImpl<>(
                    java.util.Collections.emptyList(), pageable, list.size());
        }

        return new org.springframework.data.domain.PageImpl<>(
                list.subList(start, end), pageable, list.size());
    }
}
