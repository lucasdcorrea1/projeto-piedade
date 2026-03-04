package com.ccb.piedade.controller;

import com.ccb.piedade.dto.ApiResponse;
import com.ccb.piedade.dto.ItemDTO;
import com.ccb.piedade.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/itens")
@Tag(name = "Itens", description = "Gerenciamento de itens de doacao")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    @Operation(summary = "Cadastrar item", description = "Cria um novo item de doacao")
    public ResponseEntity<ApiResponse<ItemDTO>> criar(@Valid @RequestBody ItemDTO dto) {
        ItemDTO criado = itemService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Item cadastrado com sucesso", criado));
    }

    @GetMapping
    @Operation(summary = "Listar itens ativos", description = "Retorna todos os itens ativos")
    public ResponseEntity<ApiResponse<List<ItemDTO>>> listarAtivos() {
        List<ItemDTO> itens = itemService.listarAtivos();
        return ResponseEntity.ok(ApiResponse.ok(itens));
    }

    @GetMapping("/ativos")
    @Operation(summary = "Listar itens ativos para formularios", description = "Retorna apenas itens ativos para uso em dropdowns de doacoes e entregas")
    public ResponseEntity<ApiResponse<List<ItemDTO>>> listarAtivosParaFormulario() {
        List<ItemDTO> itens = itemService.listarAtivos();
        return ResponseEntity.ok(ApiResponse.ok(itens));
    }

    @GetMapping("/todos")
    @Operation(summary = "Listar todos os itens", description = "Retorna todos os itens incluindo inativos")
    public ResponseEntity<ApiResponse<List<ItemDTO>>> listarTodos() {
        List<ItemDTO> itens = itemService.listarTodos();
        return ResponseEntity.ok(ApiResponse.ok(itens));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar item por ID", description = "Retorna um item pelo ID")
    public ResponseEntity<ApiResponse<ItemDTO>> buscarPorId(@PathVariable String id) {
        ItemDTO dto = itemService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar item", description = "Atualiza os dados de um item")
    public ResponseEntity<ApiResponse<ItemDTO>> atualizar(
            @PathVariable String id,
            @Valid @RequestBody ItemDTO dto) {
        ItemDTO atualizado = itemService.atualizar(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Item atualizado com sucesso", atualizado));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover item", description = "Desativa um item (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable String id) {
        itemService.deletar(id);
        return ResponseEntity.ok(ApiResponse.ok("Item removido com sucesso"));
    }
}
