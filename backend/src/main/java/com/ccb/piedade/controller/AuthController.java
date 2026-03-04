package com.ccb.piedade.controller;

import com.ccb.piedade.dto.ApiResponse;
import com.ccb.piedade.dto.LoginRequest;
import com.ccb.piedade.dto.LoginResponse;
import com.ccb.piedade.dto.UsuarioDTO;
import com.ccb.piedade.model.Usuario;
import com.ccb.piedade.security.JwtTokenProvider;
import com.ccb.piedade.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticacao", description = "Endpoints de autenticacao e registro")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioService usuarioService,
                          JwtTokenProvider tokenProvider,
                          PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @Operation(summary = "Realizar login", description = "Autentica o usuario e retorna o token JWT")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.findByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais invalidas");
        }

        if (!usuario.getAtivo()) {
            throw new BadCredentialsException("Usuario inativo");
        }

        String token = tokenProvider.generateToken(
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getPerfil().name()
        );

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .build();

        return ResponseEntity.ok(ApiResponse.ok("Login realizado com sucesso", response));
    }

    @PostMapping("/registro")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Registrar novo usuario", description = "Cria um novo usuario (apenas ADMIN)")
    public ResponseEntity<ApiResponse<UsuarioDTO>> registro(@Valid @RequestBody UsuarioDTO dto) {
        UsuarioDTO criado = usuarioService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Usuario registrado com sucesso", criado));
    }

    @GetMapping("/me")
    @Operation(summary = "Dados do usuario autenticado", description = "Retorna os dados do usuario logado")
    public ResponseEntity<ApiResponse<UsuarioDTO>> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();
        UsuarioDTO dto = usuarioService.buscarPorEmail(usuario.getEmail());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
