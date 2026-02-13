package com.vini.ecommerce_tech.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * Entidade Product - representa um produto no catálogo da loja.
 * Mapeada para a coleção "products" no MongoDB.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    /** Identificador único gerado pelo MongoDB */
    @Id
    private String id;

    /** Nome do produto (ex: "Notebook Dell XPS 15") */
    private String name;

    /** Descrição detalhada do produto */
    private String description;

    /** Preço do produto com precisão decimal */
    private BigDecimal price;

    /** Categoria do produto (ex: "notebooks", "teclados", "monitores") */
    private String category;

    /** Quantidade disponível em estoque */
    private Integer stock;

    /** URL da imagem do produto */
    private String imageUrl;
}