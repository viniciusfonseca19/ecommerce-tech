package com.vini.ecommerce_tech.config;

import com.vini.ecommerce_tech.model.Product;
import com.vini.ecommerce_tech.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            log.info("Banco vazio. Populando com produtos iniciais...");
            seedProducts();
            log.info("Produtos iniciais cadastrados com sucesso!");
        } else {
            log.info("Banco já contém {} produtos. Seed ignorado.", productRepository.count());
        }
    }

    private void seedProducts() {
        List<Product> products = List.of(
                Product.builder()
                        .name("Notebook Dell XPS 15")
                        .description("Notebook premium com tela OLED 4K, Intel Core i9, 32GB RAM e SSD de 1TB.")
                        .price(new BigDecimal("12999.90"))
                        .category("notebooks")
                        .stock(15)
                        .imageUrl("https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500")
                        .build(),

                Product.builder()
                        .name("MacBook Pro 14\" M3 Pro")
                        .description("Chip Apple M3 Pro, 18GB memória unificada, SSD 512GB, até 18h de bateria.")
                        .price(new BigDecimal("16499.00"))
                        .category("notebooks")
                        .stock(8)
                        .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500")
                        .build(),

                Product.builder()
                        .name("Monitor LG UltraWide 34\" Curvo")
                        .description("QHD 3440x1440, 160Hz, 1ms, HDR10, AMD FreeSync Premium.")
                        .price(new BigDecimal("3299.00"))
                        .category("monitores")
                        .stock(20)
                        .imageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500")
                        .build(),

                Product.builder()
                        .name("Teclado Mecânico HyperX Alloy Origins")
                        .description("Switches HyperX Red, RGB por tecla, layout TKL, cabo USB-C destacável.")
                        .price(new BigDecimal("589.90"))
                        .category("teclados")
                        .stock(35)
                        .imageUrl("https://images.unsplash.com/photo-1601445638532-1db6b58a3a01?w=500")
                        .build(),

                Product.builder()
                        .name("Mouse Logitech G Pro X Superlight 2")
                        .description("60g, sensor HERO 2 de 32.000 DPI, sem fio LIGHTSPEED, 95h de bateria.")
                        .price(new BigDecimal("849.90"))
                        .category("mouses")
                        .stock(40)
                        .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500")
                        .build(),

                Product.builder()
                        .name("Headset HyperX Cloud Alpha")
                        .description("Drivers duplos de câmara, microfone destacável com cancelamento de ruído.")
                        .price(new BigDecimal("449.90"))
                        .category("headsets")
                        .stock(22)
                        .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500")
                        .build(),

                Product.builder()
                        .name("SSD Samsung 990 Pro 2TB NVMe")
                        .description("PCIe 4.0, leitura até 7.450 MB/s, escrita até 6.900 MB/s.")
                        .price(new BigDecimal("879.00"))
                        .category("armazenamento")
                        .stock(50)
                        .imageUrl("https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500")
                        .build()
        );

        productRepository.saveAll(products);
    }
}