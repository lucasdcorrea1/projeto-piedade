package com.ccb.piedade.service;

import com.ccb.piedade.dto.DoacaoDTO;
import com.ccb.piedade.exception.ResourceNotFoundException;
import com.ccb.piedade.model.Doacao;
import com.ccb.piedade.model.Usuario;
import com.ccb.piedade.repository.DoacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;

    public DoacaoService(DoacaoRepository doacaoRepository) {
        this.doacaoRepository = doacaoRepository;
    }

    public DoacaoDTO criar(DoacaoDTO dto) {
        String registradoPor = resolveRegistradoPor(dto.getRegistradoPor());

        Doacao doacao = Doacao.builder()
                .data(dto.getData())
                .itens(dto.getItens())
                .origem(dto.getOrigem())
                .observacoes(dto.getObservacoes())
                .registradoPor(registradoPor)
                .criadoEm(LocalDateTime.now())
                .build();

        doacao = doacaoRepository.save(doacao);
        return toDTO(doacao);
    }

    public Page<DoacaoDTO> listarTodas(Pageable pageable) {
        return doacaoRepository.findAll(pageable).map(this::toDTO);
    }

    public DoacaoDTO buscarPorId(String id) {
        Doacao doacao = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doacao", "id", id));
        return toDTO(doacao);
    }

    public List<DoacaoDTO> buscarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return doacaoRepository.findByDataBetween(inicio, fim).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<DoacaoDTO> buscarPorOrigem(String origem) {
        return doacaoRepository.findByOrigem(origem).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DoacaoDTO atualizar(String id, DoacaoDTO dto) {
        Doacao doacao = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doacao", "id", id));

        if (dto.getData() != null) {
            doacao.setData(dto.getData());
        }
        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            doacao.setItens(dto.getItens());
        }
        if (dto.getOrigem() != null) {
            doacao.setOrigem(dto.getOrigem());
        }
        if (dto.getObservacoes() != null) {
            doacao.setObservacoes(dto.getObservacoes());
        }

        doacao = doacaoRepository.save(doacao);
        return toDTO(doacao);
    }

    public void deletar(String id) {
        if (!doacaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doacao", "id", id);
        }
        doacaoRepository.deleteById(id);
    }

    /**
     * Resolve o nome do usuario que registrou a doacao.
     * Prioriza o valor do DTO; se ausente, extrai do contexto de seguranca.
     */
    private String resolveRegistradoPor(String dtoRegistradoPor) {
        if (dtoRegistradoPor != null && !dtoRegistradoPor.isBlank()) {
            return dtoRegistradoPor;
        }
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof Usuario) {
                Usuario usuario = (Usuario) authentication.getPrincipal();
                return usuario.getNome();
            }
        } catch (Exception e) {
            // Se nao conseguir obter o usuario autenticado, retorna null
        }
        return null;
    }

    private DoacaoDTO toDTO(Doacao doacao) {
        return DoacaoDTO.builder()
                .id(doacao.getId())
                .data(doacao.getData())
                .itens(doacao.getItens())
                .origem(doacao.getOrigem())
                .observacoes(doacao.getObservacoes())
                .registradoPor(doacao.getRegistradoPor())
                .criadoEm(doacao.getCriadoEm())
                .build();
    }
}
