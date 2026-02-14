package com.vini.ecommerce_tech.services;

import com.vini.ecommerce_tech.dto.order.OrderItemRequest;
import com.vini.ecommerce_tech.dto.order.OrderRequest;
import com.vini.ecommerce_tech.dto.order.OrderResponse;
import com.vini.ecommerce_tech.exception.InsufficientStockException;
import com.vini.ecommerce_tech.model.Order;
import com.vini.ecommerce_tech.model.OrderItem;
import com.vini.ecommerce_tech.model.Product;
import com.vini.ecommerce_tech.repositories.OrderRepository;
import com.vini.ecommerce_tech.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        log.info("Criando pedido com {} itens", request.getItems().size());

        // Cria o pedido primeiro para ter referência nas foreign keys
        Order order = Order.builder()
                .status("CONFIRMED")
                .createdAt(LocalDateTime.now())
                .totalPrice(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productService.findProductOrThrow(itemRequest.getProductId());

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new InsufficientStockException(
                        String.format("Estoque insuficiente para '%s'. Disponível: %d, Solicitado: %d",
                                product.getName(),
                                product.getStock(),
                                itemRequest.getQuantity())
                );
            }

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order) // seta a referência do pedido
                    .productId(product.getId())
                    .productName(product.getName())
                    .unitPrice(product.getPrice())
                    .quantity(itemRequest.getQuantity())
                    .subtotal(subtotal)
                    .build();

            order.getItems().add(orderItem);
            totalPrice = totalPrice.add(subtotal);

            // Desconta estoque
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);

        log.info("Pedido criado com ID: {} | Total: R$ {}", savedOrder.getId(), totalPrice);
        return toResponse(savedOrder);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com ID: " + id));
        return toResponse(order);
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .items(order.getItems())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}