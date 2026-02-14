package com.vini.ecommerce_tech.dto.product;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO para criação e atualização de produtos.
 *
 * Separar o DTO da entidade é uma boa prática:
 * - Controla quais campos o cliente pode enviar
 * - Permite validações específicas para entrada de dados
 * - Desacopla a API do modelo de banco de dados
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "O nome do produto é obrigatório")
    @Size(min = 2, max = 200, message = "O nome deve ter entre 2 e 200 caracteres")
    private String name;

    @NotBlank(message = "A descrição é obrigatória")
    @Size(max = 2000, message = "A descrição pode ter no máximo 2000 caracteres")
    private String description;

    @NotNull(message = "O preço é obrigatório")
    @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero")
    @Digits(integer = 10, fraction = 2, message = "Formato de preço inválido")
    private BigDecimal price;

    @NotBlank(message = "A categoria é obrigatória")
    private String category;

    @NotNull(message = "O estoque é obrigatório")
    @Min(value = 0, message = "O estoque não pode ser negativo")
    private Integer stock;

    private String imageUrl;
}