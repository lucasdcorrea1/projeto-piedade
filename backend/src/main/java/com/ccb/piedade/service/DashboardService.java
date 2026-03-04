package com.ccb.piedade.service;

import com.ccb.piedade.dto.DashboardResumoDTO;
import com.ccb.piedade.model.Doacao;
import com.ccb.piedade.model.Entrega;
import com.ccb.piedade.model.Fiel;
import com.ccb.piedade.model.Item;
import com.ccb.piedade.model.ItemDoacao;
import com.ccb.piedade.model.ItemEntrega;
import com.ccb.piedade.repository.DoacaoRepository;
import com.ccb.piedade.repository.EntregaRepository;
import com.ccb.piedade.repository.FielRepository;
import com.ccb.piedade.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final FielRepository fielRepository;
    private final DoacaoRepository doacaoRepository;
    private final EntregaRepository entregaRepository;
    private final ItemRepository itemRepository;

    public DashboardService(FielRepository fielRepository,
                            DoacaoRepository doacaoRepository,
                            EntregaRepository entregaRepository,
                            ItemRepository itemRepository) {
        this.fielRepository = fielRepository;
        this.doacaoRepository = doacaoRepository;
        this.entregaRepository = entregaRepository;
        this.itemRepository = itemRepository;
    }

    /**
     * Retorna o resumo do dashboard com:
     * - total de fieis ativos
     * - total de doacoes do mes corrente
     * - total de entregas do mes corrente
     * - quantidade de itens pereciveis proximos do vencimento (7 dias)
     */
    public DashboardResumoDTO getResumo() {
        LocalDate now = LocalDate.now();
        LocalDate inicioMes = now.withDayOfMonth(1);
        LocalDate fimMes = now.withDayOfMonth(now.lengthOfMonth());

        long totalFieis = fielRepository.countByAtivoTrue();
        long totalDoacoesMes = doacaoRepository.countByDataBetween(inicioMes, fimMes);
        long totalEntregasMes = entregaRepository.countByDataBetween(inicioMes, fimMes);
        long itensProximosVencimento = countItensProximosVencimento();

        return DashboardResumoDTO.builder()
                .totalFieis(totalFieis)
                .totalDoacoesMes(totalDoacoesMes)
                .totalEntregasMes(totalEntregasMes)
                .itensProximosVencimento(itensProximosVencimento)
                .build();
    }

    /**
     * Retorna a quantidade de entregas agrupadas pelo bairro do fiel.
     * Faz join entre Entrega e Fiel para obter o bairro do endereco do fiel.
     */
    public Map<String, Long> getEntregasPorBairro() {
        List<Fiel> fieis = fielRepository.findAll();
        List<Entrega> todasEntregas = entregaRepository.findAll();

        if (todasEntregas.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<String, String> fielBairroMap = new HashMap<>();
        for (Fiel fiel : fieis) {
            if (fiel.getId() != null
                    && fiel.getEndereco() != null
                    && fiel.getEndereco().getBairro() != null
                    && !fiel.getEndereco().getBairro().isBlank()) {
                fielBairroMap.put(fiel.getId(), fiel.getEndereco().getBairro());
            }
        }

        Map<String, Long> entregasPorBairro = new HashMap<>();
        for (Entrega entrega : todasEntregas) {
            String fielId = entrega.getFielId();
            String bairro = (fielId != null)
                    ? fielBairroMap.getOrDefault(fielId, "Sem bairro")
                    : "Sem bairro";
            entregasPorBairro.merge(bairro, 1L, Long::sum);
        }

        return entregasPorBairro.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    /**
     * Retorna a quantidade de doacoes agrupadas por mes/ano (ex: "Jan/2026").
     */
    public Map<String, Long> getDoacoesPorPeriodo(LocalDate inicio, LocalDate fim) {
        if (inicio == null || fim == null) {
            return Collections.emptyMap();
        }

        List<Doacao> doacoes = doacaoRepository.findByDataBetween(inicio, fim);

        if (doacoes.isEmpty()) {
            return Collections.emptyMap();
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM/yyyy", new Locale("pt", "BR"));

        Map<String, Long> doacoesPorMes = new LinkedHashMap<>();
        for (Doacao doacao : doacoes) {
            if (doacao.getData() != null) {
                String mesAno = doacao.getData().format(formatter);
                // Capitaliza a primeira letra: "jan/2026" -> "Jan/2026"
                mesAno = mesAno.substring(0, 1).toUpperCase() + mesAno.substring(1);
                doacoesPorMes.merge(mesAno, 1L, Long::sum);
            }
        }

        return doacoesPorMes;
    }

    /**
     * Retorna os 10 itens mais doados, agregando a quantidade total de todas as doacoes.
     * Cada item possui os campos: nome, quantidade.
     */
    public List<Map<String, Object>> getItensMaisDoados() {
        List<Doacao> todasDoacoes = doacaoRepository.findAll();

        if (todasDoacoes.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, String> itemNomes = buildItemNomeMap();

        Map<String, Double> quantidadePorItem = new HashMap<>();
        Map<String, String> nomesPorKey = new HashMap<>();

        for (Doacao doacao : todasDoacoes) {
            if (doacao.getItens() == null) {
                continue;
            }
            for (ItemDoacao item : doacao.getItens()) {
                if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                    continue;
                }
                String key = resolveItemKey(item.getItemId(), item.getNomeItem());
                quantidadePorItem.merge(key, item.getQuantidade(), Double::sum);
                if (!nomesPorKey.containsKey(key)) {
                    nomesPorKey.put(key, resolveItemNome(item.getItemId(), item.getNomeItem(), itemNomes));
                }
            }
        }

        return quantidadePorItem.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("nome", nomesPorKey.getOrDefault(entry.getKey(), entry.getKey()));
                    map.put("quantidade", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    /**
     * Calcula o estoque atual: (total doado - total entregue) por item.
     * Retorna com campos: nome, unidadeMedida, saldo.
     */
    public List<Map<String, Object>> getEstoque() {
        List<Doacao> todasDoacoes = doacaoRepository.findAll();
        List<Entrega> todasEntregas = entregaRepository.findAll();

        Map<String, String> itemNomes = buildItemNomeMap();
        Map<String, String> itemUnidades = buildItemUnidadeMap();

        Map<String, Double> entradas = new HashMap<>();
        Map<String, String> nomesPorKey = new HashMap<>();
        Map<String, String> unidadesPorKey = new HashMap<>();

        for (Doacao doacao : todasDoacoes) {
            if (doacao.getItens() == null) {
                continue;
            }
            for (ItemDoacao item : doacao.getItens()) {
                if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                    continue;
                }
                String key = resolveItemKey(item.getItemId(), item.getNomeItem());
                entradas.merge(key, item.getQuantidade(), Double::sum);
                if (!nomesPorKey.containsKey(key)) {
                    nomesPorKey.put(key, resolveItemNome(item.getItemId(), item.getNomeItem(), itemNomes));
                }
                if (!unidadesPorKey.containsKey(key) && item.getItemId() != null) {
                    String unidade = itemUnidades.get(item.getItemId());
                    if (unidade != null) {
                        unidadesPorKey.put(key, unidade);
                    }
                }
            }
        }

        Map<String, Double> saidas = new HashMap<>();
        for (Entrega entrega : todasEntregas) {
            if (entrega.getItens() == null) {
                continue;
            }
            for (ItemEntrega item : entrega.getItens()) {
                if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                    continue;
                }
                String key = resolveItemKey(item.getItemId(), item.getNomeItem());
                saidas.merge(key, item.getQuantidade(), Double::sum);
                if (!nomesPorKey.containsKey(key)) {
                    nomesPorKey.put(key, resolveItemNome(item.getItemId(), item.getNomeItem(), itemNomes));
                }
                if (!unidadesPorKey.containsKey(key) && item.getItemId() != null) {
                    String unidade = itemUnidades.get(item.getItemId());
                    if (unidade != null) {
                        unidadesPorKey.put(key, unidade);
                    }
                }
            }
        }

        // Merge all item keys
        Map<String, Double> todosItens = new HashMap<>(entradas);
        for (String key : saidas.keySet()) {
            todosItens.putIfAbsent(key, 0.0);
        }

        List<Map<String, Object>> estoque = new ArrayList<>();
        for (Map.Entry<String, Double> entry : todosItens.entrySet()) {
            String itemKey = entry.getKey();
            double totalEntrada = entradas.getOrDefault(itemKey, 0.0);
            double totalSaida = saidas.getOrDefault(itemKey, 0.0);
            double saldo = totalEntrada - totalSaida;

            Map<String, Object> itemEstoque = new LinkedHashMap<>();
            itemEstoque.put("nome", nomesPorKey.getOrDefault(itemKey, itemKey));
            itemEstoque.put("unidadeMedida", unidadesPorKey.getOrDefault(itemKey, "unidade"));
            itemEstoque.put("saldo", saldo);
            estoque.add(itemEstoque);
        }

        estoque.sort((a, b) -> {
            String nomeA = (String) a.get("nome");
            String nomeB = (String) b.get("nome");
            if (nomeA == null && nomeB == null) return 0;
            if (nomeA == null) return 1;
            if (nomeB == null) return -1;
            return nomeA.compareToIgnoreCase(nomeB);
        });

        return estoque;
    }

    /**
     * Conta itens pereciveis com validade nos proximos 7 dias.
     */
    private long countItensProximosVencimento() {
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(7);

        List<Doacao> todasDoacoes = doacaoRepository.findAll();

        if (todasDoacoes.isEmpty()) {
            return 0;
        }

        long count = 0;
        for (Doacao doacao : todasDoacoes) {
            if (doacao.getItens() == null) {
                continue;
            }
            for (ItemDoacao item : doacao.getItens()) {
                if (item.getValidade() != null
                        && !item.getValidade().isBefore(hoje)
                        && !item.getValidade().isAfter(limite)) {
                    count++;
                }
            }
        }

        return count;
    }

    /**
     * Constroi um mapa de itemId -> nome a partir do cadastro de itens.
     */
    private Map<String, String> buildItemNomeMap() {
        Map<String, String> map = new HashMap<>();
        try {
            List<Item> itens = itemRepository.findAll();
            for (Item item : itens) {
                if (item.getId() != null && item.getNome() != null) {
                    map.put(item.getId(), item.getNome());
                }
            }
        } catch (Exception e) {
            // Se nao conseguir carregar itens, continua com mapa vazio
        }
        return map;
    }

    /**
     * Constroi um mapa de itemId -> unidadeMedida a partir do cadastro de itens.
     */
    private Map<String, String> buildItemUnidadeMap() {
        Map<String, String> map = new HashMap<>();
        try {
            List<Item> itens = itemRepository.findAll();
            for (Item item : itens) {
                if (item.getId() != null && item.getUnidadeMedida() != null) {
                    map.put(item.getId(), item.getUnidadeMedida());
                }
            }
        } catch (Exception e) {
            // Se nao conseguir carregar itens, continua com mapa vazio
        }
        return map;
    }

    /**
     * Resolve a chave unica de um item priorizando itemId.
     */
    private String resolveItemKey(String itemId, String nomeItem) {
        if (itemId != null && !itemId.isBlank()) {
            return itemId;
        }
        return (nomeItem != null && !nomeItem.isBlank()) ? nomeItem : "desconhecido";
    }

    /**
     * Resolve o nome de exibicao de um item priorizando o cadastro de itens.
     */
    private String resolveItemNome(String itemId, String nomeItem, Map<String, String> itemNomes) {
        if (itemId != null && itemNomes.containsKey(itemId)) {
            return itemNomes.get(itemId);
        }
        if (nomeItem != null && !nomeItem.isBlank()) {
            return nomeItem;
        }
        return "Item desconhecido";
    }
}
