package com.vini.ecommerce_tech.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidade Order - representa um pedido finalizado pelo cliente.
 * Mapeada para a coleção "orders" no MongoDB.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    /** Identificador único do pedido */
    @Id
    private String id;

    /**
     * Lista de itens do pedido.
     * Armazena uma cópia dos produtos no momento da compra
     * (evita que alterações futuras nos produtos afetem pedidos antigos).
     */
    private List<OrderItem> items;

    /** Valor total calculado do pedido */
    private BigDecimal totalPrice;

    /** Status do pedido: PENDING, CONFIRMED, DELIVERED, CANCELLED */
    private String status;

    /** Data e hora em que o pedido foi criado */
    private LocalDateTime createdAt;
}