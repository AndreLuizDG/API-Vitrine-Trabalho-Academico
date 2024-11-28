package br.edu.fatec.lins.apiVitrine.repositorio;

import br.edu.fatec.lins.apiVitrine.modelo.loja.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProdutoRepositorio extends JpaRepository<Produto, UUID> {
}
