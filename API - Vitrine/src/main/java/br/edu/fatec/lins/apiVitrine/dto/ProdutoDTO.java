package br.edu.fatec.lins.apiVitrine.dto;

import jakarta.persistence.Column;

public record ProdutoDTO(String nome, String descricao, Double valor,
                         int qtdeEstoque, int estoqueMinimo, String imagem) {
}
