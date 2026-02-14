package com.vini.ecommerce_tech.repositories;

import com.vini.ecommerce_tech.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repositório para operações de banco de dados da entidade Product.
 *
 * O MongoRepository já fornece os métodos CRUD básicos:
 * - findAll(), findById(), save(), deleteById(), etc.
 *
 * Aqui adicionamos queries customizadas usando a convenção de nomes do Spring Data.
 */
@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    /**
     * Busca produtos por categoria (case-insensitive).
     * Spring Data converte automaticamente esse método em uma query MongoDB.
     */
    List<Product> findByCategoryIgnoreCase(String category);

    /**
     * Busca produtos que contenham o nome informado (busca parcial).
     */
    List<Product> findByNameContainingIgnoreCase(String name);

    /**
     * Busca produtos dentro de uma faixa de preço.
     */
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * Busca produtos com estoque disponível (stock > 0).
     */
    List<Product> findByStockGreaterThan(Integer stock);
}