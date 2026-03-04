package com.ccb.piedade.service;

import com.ccb.piedade.dto.ItemDTO;
import com.ccb.piedade.exception.ResourceNotFoundException;
import com.ccb.piedade.model.Item;
import com.ccb.piedade.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public ItemDTO criar(ItemDTO dto) {
        Item item = Item.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .categoria(dto.getCategoria())
                .unidadeMedida(dto.getUnidadeMedida())
                .ativo(true)
                .build();

        item = itemRepository.save(item);
        return toDTO(item);
    }

    public List<ItemDTO> listarAtivos() {
        return itemRepository.findByAtivoTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> listarTodos() {
        return itemRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ItemDTO buscarPorId(String id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "id", id));
        return toDTO(item);
    }

    public ItemDTO atualizar(String id, ItemDTO dto) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "id", id));

        if (dto.getNome() != null) {
            item.setNome(dto.getNome());
        }
        if (dto.getDescricao() != null) {
            item.setDescricao(dto.getDescricao());
        }
        if (dto.getCategoria() != null) {
            item.setCategoria(dto.getCategoria());
        }
        if (dto.getUnidadeMedida() != null) {
            item.setUnidadeMedida(dto.getUnidadeMedida());
        }

        item = itemRepository.save(item);
        return toDTO(item);
    }

    public void deletar(String id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "id", id));
        item.setAtivo(false);
        itemRepository.save(item);
    }

    private ItemDTO toDTO(Item item) {
        return ItemDTO.builder()
                .id(item.getId())
                .nome(item.getNome())
                .descricao(item.getDescricao())
                .categoria(item.getCategoria())
                .unidadeMedida(item.getUnidadeMedida())
                .ativo(item.getAtivo())
                .build();
    }
}
