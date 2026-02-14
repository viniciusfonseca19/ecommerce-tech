package com.vini.ecommerce_tech.dto.order;

import com.vini.ecommerce_tech.model.OrderItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de resposta para pedidos.
 * Retorna os detalhes completos do pedido ao cliente.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String id;
    private List<OrderItem> items;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
}