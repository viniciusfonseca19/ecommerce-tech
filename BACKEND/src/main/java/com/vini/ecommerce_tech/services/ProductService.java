package com.vini.ecommerce_tech.services;

import com.vini.ecommerce_tech.dto.product.ProductRequest;
import com.vini.ecommerce_tech.dto.product.ProductResponse;
import com.vini.ecommerce_tech.exception.ProductNotFoundException;
import com.vini.ecommerce_tech.model.Product;
import com.vini.ecommerce_tech.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllProducts() {
        log.debug("Buscando todos os produtos");
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        log.debug("Buscando produtos da categoria: {}", category);
        return productRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> searchProducts(String name) {
        log.debug("Buscando produtos com nome contendo: {}", name);
        return productRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getProductById(String id) {
        log.debug("Buscando produto com ID: {}", id);
        Product product = findProductOrThrow(id);
        return toResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        log.info("Criando novo produto: {}", request.getName());

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .build();

        Product saved = productRepository.save(product);
        log.info("Produto criado com ID: {}", saved.getId());

        return toResponse(saved);
    }

    public ProductResponse updateProduct(String id, ProductRequest request) {
        log.info("Atualizando produto com ID: {}", id);

        Product existing = findProductOrThrow(id);

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setCategory(request.getCategory());
        existing.setStock(request.getStock());
        existing.setImageUrl(request.getImageUrl());

        Product updated = productRepository.save(existing);
        log.info("Produto {} atualizado com sucesso", id);

        return toResponse(updated);
    }

    public void deleteProduct(String id) {
        log.info("Deletando produto com ID: {}", id);
        findProductOrThrow(id);
        productRepository.deleteById(id);
        log.info("Produto {} deletado com sucesso", id);
    }

    Product findProductOrThrow(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Produto não encontrado com ID: " + id));
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .available(product.getStock() != null && product.getStock() > 0)
                .build();
    }
}