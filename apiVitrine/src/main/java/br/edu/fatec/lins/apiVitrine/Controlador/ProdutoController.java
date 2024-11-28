package br.edu.fatec.lins.apiVitrine.Controlador;

import br.edu.fatec.lins.apiVitrine.dto.ProdutoDTO;
import br.edu.fatec.lins.apiVitrine.modelo.loja.Produto;
import br.edu.fatec.lins.apiVitrine.repositorio.ProdutoRepositorio;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RestController
public class ProdutoController {

    @Autowired
    ProdutoRepositorio repositorio;

    @PostMapping("/produtos")
    public ResponseEntity<Produto> salvarProduto(@RequestBody ProdutoDTO produtoDTO){
        var produtoModelo = new Produto();
        BeanUtils.copyProperties(produtoDTO, produtoModelo);
        return ResponseEntity.status(HttpStatus.CREATED).body(repositorio.save(produtoModelo));
    }

    @GetMapping("/produtos")
    public ResponseEntity<List<Produto>> getAllProdutos(){
        return ResponseEntity.status(HttpStatus.OK).body(repositorio.findAll());
    }

    @GetMapping("/produtos/{id}")
    public ResponseEntity<Object> getProdutoPorId(@PathVariable(value="id") UUID id) {
        Optional<Produto> produto = repositorio.findById(id);
        if(produto.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado");
        }
        return ResponseEntity.status(HttpStatus.OK).body(produto.get());
    }

    @PutMapping("/produtos/{id}")
    public ResponseEntity<Object> updateProduto(@PathVariable(value="id") UUID id,
                                                @RequestBody ProdutoDTO prodDTO){
        Optional<Produto> produto = repositorio.findById(id);
        if(produto.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado");
        }
        BeanUtils.copyProperties(prodDTO, produto.get());
        return ResponseEntity.status(HttpStatus.OK).body(repositorio.save(produto.get()));
    }

    @DeleteMapping("/produtos/{id}")
    public ResponseEntity<Object> deleteProduto(@PathVariable(value="id") UUID id){
        Optional<Produto> produto = repositorio.findById(id);
        if(produto.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado");
        }
        repositorio.delete(produto.get());
        return ResponseEntity.status(HttpStatus.OK).body("Produto removido com sucesso!");
    }
}











