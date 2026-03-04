package com.ccb.piedade;

import com.ccb.piedade.model.Item;
import com.ccb.piedade.model.Usuario;
import com.ccb.piedade.model.enums.CategoriaItem;
import com.ccb.piedade.model.enums.Perfil;
import com.ccb.piedade.repository.ItemRepository;
import com.ccb.piedade.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UsuarioRepository usuarioRepository;
    private final ItemRepository itemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository,
                      ItemRepository itemRepository,
                      PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.itemRepository = itemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedItems();
    }

    private void seedAdminUser() {
        if (usuarioRepository.existsByEmail("admin@ccb.org")) {
            logger.info("Usuario administrador ja existe. Seed de usuario ignorado.");
            return;
        }

        Usuario admin = Usuario.builder()
                .nome("Administrador")
                .email("admin@ccb.org")
                .senha(passwordEncoder.encode("admin123"))
                .perfil(Perfil.ADMIN)
                .congregacao("Central")
                .ativo(true)
                .criadoEm(LocalDateTime.now())
                .atualizadoEm(LocalDateTime.now())
                .build();

        usuarioRepository.save(admin);
        logger.info("Usuario administrador criado com sucesso: admin@ccb.org / admin123");
    }

    private void seedItems() {
        if (itemRepository.count() > 0) {
            logger.info("Itens ja existem no banco. Seed de itens ignorado.");
            return;
        }

        List<Item> itens = List.of(
                Item.builder()
                        .nome("Cesta Basica")
                        .descricao("Cesta basica completa com alimentos essenciais")
                        .categoria(CategoriaItem.NAO_PERECIVEL)
                        .unidadeMedida("un")
                        .ativo(true)
                        .build(),
                Item.builder()
                        .nome("Arroz 5kg")
                        .descricao("Pacote de arroz tipo 1 com 5 quilos")
                        .categoria(CategoriaItem.NAO_PERECIVEL)
                        .unidadeMedida("pct")
                        .ativo(true)
                        .build(),
                Item.builder()
                        .nome("Leite")
                        .descricao("Leite integral")
                        .categoria(CategoriaItem.PERECIVEL)
                        .unidadeMedida("L")
                        .ativo(true)
                        .build(),
                Item.builder()
                        .nome("Frutas")
                        .descricao("Frutas diversas da estacao")
                        .categoria(CategoriaItem.PERECIVEL)
                        .unidadeMedida("kg")
                        .ativo(true)
                        .build(),
                Item.builder()
                        .nome("Cobertor")
                        .descricao("Cobertor de casal")
                        .categoria(CategoriaItem.NAO_PERECIVEL)
                        .unidadeMedida("un")
                        .ativo(true)
                        .build()
        );

        itemRepository.saveAll(itens);
        logger.info("Itens de exemplo criados com sucesso: {} itens inseridos.", itens.size());
    }
}
