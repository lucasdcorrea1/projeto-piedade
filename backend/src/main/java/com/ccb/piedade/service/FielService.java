package com.ccb.piedade.service;

import com.ccb.piedade.dto.EntregaDTO;
import com.ccb.piedade.dto.FielDTO;
import com.ccb.piedade.exception.ResourceNotFoundException;
import com.ccb.piedade.model.Endereco;
import com.ccb.piedade.model.Entrega;
import com.ccb.piedade.model.Fiel;
import com.ccb.piedade.repository.EntregaRepository;
import com.ccb.piedade.repository.FielRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FielService {

    private final FielRepository fielRepository;
    private final EntregaRepository entregaRepository;

    public FielService(FielRepository fielRepository, EntregaRepository entregaRepository) {
        this.fielRepository = fielRepository;
        this.entregaRepository = entregaRepository;
    }

    public FielDTO criar(FielDTO dto) {
        Endereco endereco = null;
        if (dto.getEndereco() != null) {
            endereco = dto.getEndereco();
        }

        Fiel fiel = Fiel.builder()
                .nome(dto.getNome())
                .cpf(dto.getCpf())
                .telefone(dto.getTelefone())
                .endereco(endereco)
                .congregacao(dto.getCongregacao())
                .observacoes(dto.getObservacoes())
                .ativo(true)
                .criadoEm(LocalDateTime.now())
                .atualizadoEm(LocalDateTime.now())
                .build();

        fiel = fielRepository.save(fiel);
        return toDTO(fiel);
    }

    public Page<FielDTO> listarAtivos(Pageable pageable) {
        return fielRepository.findByAtivoTrue(pageable).map(this::toDTO);
    }

    public List<FielDTO> listarTodosAtivos() {
        return fielRepository.findByAtivoTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public FielDTO buscarPorId(String id) {
        Fiel fiel = fielRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fiel", "id", id));
        return toDTO(fiel);
    }

    public Page<FielDTO> buscarPorNome(String nome, Pageable pageable) {
        return fielRepository.findByNomeContainingIgnoreCaseAndAtivoTrue(nome, pageable)
                .map(this::toDTO);
    }

    public List<FielDTO> buscarPorBairro(String bairro) {
        if (bairro == null || bairro.isBlank()) {
            return Collections.emptyList();
        }
        return fielRepository.findByEnderecoBairroContainingIgnoreCaseAndAtivoTrue(bairro).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<FielDTO> buscarPorCidade(String cidade) {
        if (cidade == null || cidade.isBlank()) {
            return Collections.emptyList();
        }
        return fielRepository.findByEnderecoCidadeContainingIgnoreCaseAndAtivoTrue(cidade).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public FielDTO atualizar(String id, FielDTO dto) {
        Fiel fiel = fielRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fiel", "id", id));

        if (dto.getNome() != null) {
            fiel.setNome(dto.getNome());
        }
        if (dto.getCpf() != null) {
            fiel.setCpf(dto.getCpf());
        }
        if (dto.getTelefone() != null) {
            fiel.setTelefone(dto.getTelefone());
        }
        if (dto.getEndereco() != null) {
            fiel.setEndereco(dto.getEndereco());
        }
        if (dto.getCongregacao() != null) {
            fiel.setCongregacao(dto.getCongregacao());
        }
        if (dto.getObservacoes() != null) {
            fiel.setObservacoes(dto.getObservacoes());
        }

        fiel.setAtualizadoEm(LocalDateTime.now());
        fiel = fielRepository.save(fiel);
        return toDTO(fiel);
    }

    public void deletar(String id) {
        Fiel fiel = fielRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fiel", "id", id));
        fiel.setAtivo(false);
        fiel.setAtualizadoEm(LocalDateTime.now());
        fielRepository.save(fiel);
    }

    public List<EntregaDTO> getHistoricoEntregas(String fielId) {
        if (!fielRepository.existsById(fielId)) {
            throw new ResourceNotFoundException("Fiel", "id", fielId);
        }
        return entregaRepository.findByFielId(fielId).stream()
                .map(this::toEntregaDTO)
                .collect(Collectors.toList());
    }

    private FielDTO toDTO(Fiel fiel) {
        return FielDTO.builder()
                .id(fiel.getId())
                .nome(fiel.getNome())
                .cpf(fiel.getCpf())
                .telefone(fiel.getTelefone())
                .endereco(fiel.getEndereco())
                .congregacao(fiel.getCongregacao())
                .observacoes(fiel.getObservacoes())
                .ativo(fiel.getAtivo())
                .criadoEm(fiel.getCriadoEm())
                .atualizadoEm(fiel.getAtualizadoEm())
                .build();
    }

    private EntregaDTO toEntregaDTO(Entrega entrega) {
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
