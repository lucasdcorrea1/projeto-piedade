package com.ccb.piedade.service;

import com.ccb.piedade.dto.UsuarioDTO;
import com.ccb.piedade.exception.BadRequestException;
import com.ccb.piedade.exception.ResourceNotFoundException;
import com.ccb.piedade.model.Usuario;
import com.ccb.piedade.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioDTO criar(UsuarioDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email ja cadastrado: " + dto.getEmail());
        }

        if (dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new BadRequestException("Senha e obrigatoria para criacao de usuario");
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .perfil(dto.getPerfil())
                .congregacao(dto.getCongregacao())
                .ativo(dto.getAtivo() != null ? dto.getAtivo() : true)
                .criadoEm(LocalDateTime.now())
                .atualizadoEm(LocalDateTime.now())
                .build();

        usuario = usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO buscarPorId(String id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        return toDTO(usuario);
    }

    public UsuarioDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));
        return toDTO(usuario);
    }

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));
    }

    public UsuarioDTO atualizar(String id, UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));

        if (dto.getNome() != null) {
            usuario.setNome(dto.getNome());
        }
        if (dto.getEmail() != null && !dto.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(dto.getEmail())) {
                throw new BadRequestException("Email ja cadastrado: " + dto.getEmail());
            }
            usuario.setEmail(dto.getEmail());
        }
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        if (dto.getPerfil() != null) {
            usuario.setPerfil(dto.getPerfil());
        }
        if (dto.getCongregacao() != null) {
            usuario.setCongregacao(dto.getCongregacao());
        }
        if (dto.getAtivo() != null) {
            usuario.setAtivo(dto.getAtivo());
        }

        usuario.setAtualizadoEm(LocalDateTime.now());
        usuario = usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    /**
     * Realiza soft delete do usuario, marcando como inativo em vez de remover do banco.
     */
    public void deletar(String id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        usuario.setAtivo(false);
        usuario.setAtualizadoEm(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .congregacao(usuario.getCongregacao())
                .ativo(usuario.getAtivo())
                .criadoEm(usuario.getCriadoEm())
                .atualizadoEm(usuario.getAtualizadoEm())
                .build();
    }
}
