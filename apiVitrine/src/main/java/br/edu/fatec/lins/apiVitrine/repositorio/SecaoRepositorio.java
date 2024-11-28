package br.edu.fatec.lins.apiVitrine.repositorio;

import br.edu.fatec.lins.apiVitrine.modelo.loja.Produto;
import br.edu.fatec.lins.apiVitrine.modelo.loja.Secao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SecaoRepositorio extends JpaRepository<Secao, UUID> {
}
