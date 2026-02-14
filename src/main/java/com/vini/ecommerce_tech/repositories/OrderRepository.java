package com.vini.ecommerce_tech.repositories;

import com.vini.ecommerce_tech.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositório para operações de banco de dados da entidade Order.
 */
@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    /**
     * Busca pedidos por status (ex: PENDING, CONFIRMED, DELIVERED).
     */
    List<Order> findByStatus(String status);

    /**
     * Busca pedidos criados em um intervalo de datas.
     */
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}