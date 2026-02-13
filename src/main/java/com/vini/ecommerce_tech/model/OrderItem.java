package com.vini.ecommerce_tech.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Documento embutido que representa um item dentro de um pedido.
 * Armazena um snapshot do produto no momento da compra.
 *
 * Não é uma coleção separada — é embutido diretamente no documento Order.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    /** ID do produto original (para referência) */
    private String productId;

    /** Nome do produto no momento da compra */
    private String productName;

    /** Preço unitário no momento da compra */
    private BigDecimal unitPrice;

    /** Quantidade solicitada */
    private Integer quantity;

    /** Subtotal: unitPrice * quantity */
    private BigDecimal subtotal;
}