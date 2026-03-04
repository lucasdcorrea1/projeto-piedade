package com.ccb.piedade.service;

import com.ccb.piedade.dto.EntregaDTO;
import com.ccb.piedade.exception.BadRequestException;
import com.ccb.piedade.exception.ResourceNotFoundException;
import com.ccb.piedade.model.Entrega;
import com.ccb.piedade.model.Fiel;
import com.ccb.piedade.model.Usuario;
import com.ccb.piedade.model.enums.StatusEntrega;
import com.ccb.piedade.repository.EntregaRepository;
import com.ccb.piedade.repository.FielRepository;
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
public class EntregaService {

    private final EntregaRepository entregaRepository;
    private final FielRepository fielRepository;

    public EntregaService(EntregaRepository entregaRepository, FielRepository fielRepository) {
        this.entregaRepository = entregaRepository;
        this.fielRepository = fielRepository;
    }

    public EntregaDTO criar(EntregaDTO dto) {
        Fiel fiel = fielRepository.findById(dto.getFielId())
                .orElseThrow(() -> new ResourceNotFoundException("Fiel", "id", dto.getFielId()));

        String registradoPor = resolveRegistradoPor(dto.getRegistradoPor());

        Entrega entrega = Entrega.builder()
                .fielId(fiel.getId())
                .nomeFiel(fiel.getNome())
                .data(dto.getData())
                .itens(dto.getItens())
                .status(StatusEntrega.PENDENTE)
                .observacoes(dto.getObservacoes())
                .registradoPor(registradoPor)
                .criadoEm(LocalDateTime.now())
                .build();

        entrega = entregaRepository.save(entrega);
        return toDTO(entrega);
    }

    public Page<EntregaDTO> listarTodas(Pageable pageable) {
        return entregaRepository.findAll(pageable).map(this::toDTO);
    }

    public EntregaDTO buscarPorId(String id) {
        Entrega entrega = entregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrega", "id", id));
        return toDTO(entrega);
    }

    public List<EntregaDTO> buscarPorFiel(String fielId) {
        return entregaRepository.findByFielId(fielId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<EntregaDTO> buscarPorStatus(StatusEntrega status) {
        return entregaRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<EntregaDTO> buscarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return entregaRepository.findByDataBetween(inicio, fim).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EntregaDTO atualizar(String id, EntregaDTO dto) {
        Entrega entrega = entregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrega", "id", id));

        if (dto.getFielId() != null) {
            Fiel fiel = fielRepository.findById(dto.getFielId())
                    .orElseThrow(() -> new ResourceNotFoundException("Fiel", "id", dto.getFielId()));
            entrega.setFielId(fiel.getId());
            entrega.setNomeFiel(fiel.getNome());
        }
        if (dto.getData() != null) {
            entrega.setData(dto.getData());
        }
        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            entrega.setItens(dto.getItens());
        }
        if (dto.getObservacoes() != null) {
            entrega.setObservacoes(dto.getObservacoes());
        }

        entrega = entregaRepository.save(entrega);
        return toDTO(entrega);
    }

    public EntregaDTO atualizarStatus(String id, StatusEntrega novoStatus) {
        Entrega entrega = entregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrega", "id", id));

        if (entrega.getStatus() == StatusEntrega.CANCELADA) {
            throw new BadRequestException("Nao e possivel alterar o status de uma entrega cancelada");
        }
        if (entrega.getStatus() == StatusEntrega.ENTREGUE && novoStatus == StatusEntrega.PENDENTE) {
            throw new BadRequestException("Nao e possivel reverter uma entrega ja realizada para pendente");
        }

        entrega.setStatus(novoStatus);

        if (novoStatus == StatusEntrega.ENTREGUE) {
            entrega.setEntregueEm(LocalDateTime.now());
        }

        entrega = entregaRepository.save(entrega);
        return toDTO(entrega);
    }

    public void deletar(String id) {
        if (!entregaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Entrega", "id", id);
        }
        entregaRepository.deleteById(id);
    }

    /**
     * Resolve o nome do usuario que registrou a entrega.
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

    private EntregaDTO toDTO(Entrega entrega) {
        return EntregaDTO.builder()
                .id(entrega.getId())
                .fielId(entrega.getFielId())
                .nomeFiel(entrega.getNomeFiel())
                .data(entrega.getData())
                .itens(entrega.getItens())
                .status(entrega.getStatus())
                .observacoes(entrega.getObservacoes())
                .registradoPor(entrega.getRegistradoPor())
                .entregueEm(entrega.getEntregueEm())
                .criadoEm(entrega.getCriadoEm())
                .build();
    }
}
