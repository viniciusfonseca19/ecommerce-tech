package com.vini.ecommerce_tech.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para criação de um novo pedido.
 * Recebe a lista de itens do carrinho do cliente.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotEmpty(message = "O pedido deve conter pelo menos um item")
    @Valid
    private List<OrderItemRequest> items;
}