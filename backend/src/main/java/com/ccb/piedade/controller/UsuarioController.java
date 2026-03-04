package com.ccb.piedade.controller;

import com.ccb.piedade.dto.ApiResponse;
import com.ccb.piedade.dto.UsuarioDTO;
import com.ccb.piedade.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Usuarios", description = "Gerenciamento de usuarios (somente ADMIN)")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Retorna todos os usuarios do sistema")
    public ResponseEntity<ApiResponse<List<UsuarioDTO>>> listar() {
        List<UsuarioDTO> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(ApiResponse.ok(usuarios));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuario por ID", description = "Retorna um usuario pelo ID")
    public ResponseEntity<ApiResponse<UsuarioDTO>> buscarPorId(@PathVariable String id) {
        UsuarioDTO dto = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping
    @Operation(summary = "Criar usuario", description = "Cria um novo usuario")
    public ResponseEntity<ApiResponse<UsuarioDTO>> criar(@Valid @RequestBody UsuarioDTO dto) {
        UsuarioDTO criado = usuarioService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Usuario criado com sucesso", criado));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar usuario", description = "Atualiza os dados de um usuario")
    public ResponseEntity<ApiResponse<UsuarioDTO>> atualizar(
            @PathVariable String id,
            @Valid @RequestBody UsuarioDTO dto) {
        UsuarioDTO atualizado = usuarioService.atualizar(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Usuario atualizado com sucesso", atualizado));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover usuario", description = "Remove um usuario do sistema")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable String id) {
        usuarioService.deletar(id);
        return ResponseEntity.ok(ApiResponse.ok("Usuario removido com sucesso"));
    }
}
