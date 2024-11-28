package br.edu.fatec.lins.apiVitrine.Controlador;

import br.edu.fatec.lins.apiVitrine.dto.ProdutoDTO;
import br.edu.fatec.lins.apiVitrine.dto.SecaoDTO;
import br.edu.fatec.lins.apiVitrine.modelo.loja.Produto;
import br.edu.fatec.lins.apiVitrine.modelo.loja.Secao;
import br.edu.fatec.lins.apiVitrine.repositorio.ProdutoRepositorio;
import br.edu.fatec.lins.apiVitrine.repositorio.SecaoRepositorio;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class SecaoController {
    @Autowired
    SecaoRepositorio repositorio;

    @PostMapping("/secoes")
    public ResponseEntity<Secao> salvarSecao(@RequestBody SecaoDTO secaoDTO){
        var secaoModelo = new Secao();
        BeanUtils.copyProperties(secaoDTO, secaoModelo);
        return ResponseEntity.status(HttpStatus.CREATED).body(repositorio.save(secaoModelo));
    }

    @GetMapping("/secoes")
    public ResponseEntity<List<Secao>> getAllSecoes(){
        return ResponseEntity.status(HttpStatus.OK).body(repositorio.findAll());
    }

    @GetMapping("/secoes/{id}")
    public ResponseEntity<Object> getSecaoPorId(@PathVariable(value="id") UUID id) {
        Optional<Secao> secao = repositorio.findById(id);
        if(secao.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seção não encontrada");
        }
        return ResponseEntity.status(HttpStatus.OK).body(secao.get());
    }

    @PutMapping("/secoes/{id}")
    public ResponseEntity<Object> updateSecao(@PathVariable(value="id") UUID id,
                                                @RequestBody SecaoDTO secaoDTO){
        Optional<Secao> secao = repositorio.findById(id);
        if(secao.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seção não encontrada");
        }
        BeanUtils.copyProperties(secaoDTO, secao.get());
        return ResponseEntity.status(HttpStatus.OK).body(repositorio.save(secao.get()));
    }
    @DeleteMapping("/secoes/{id}")
    public ResponseEntity<Object> deleteSecao(@PathVariable(value="id") UUID id){
        Optional<Secao> secao = repositorio.findById(id);
        if(secao.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seção não encontrada");
        }
        repositorio.delete(secao.get());
        return ResponseEntity.status(HttpStatus.OK).body("Seção removida com sucesso!");
    }
}
