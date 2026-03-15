package com.elotech.desafio.controller;

import com.elotech.desafio.dto.LivroRequestDTO;
import com.elotech.desafio.dto.LivroResponseDTO;
import com.elotech.desafio.entity.Livro;
import com.elotech.desafio.service.LivroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/livros")
public class LivroController {

    private final LivroService livroService;

    @PostMapping
    public ResponseEntity<LivroResponseDTO> criarLivro(@Valid @RequestBody LivroRequestDTO requestDTO){

        Livro livroNovo = livroService.criarLivro(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(new LivroResponseDTO(livroNovo.getId(), livroNovo.getTitulo(),
                livroNovo.getAutor(), livroNovo.getIsbn(), livroNovo.getDataPublicacao(), livroNovo.getCategoria()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivroResponseDTO> retornaLivro(@PathVariable Long id){

        Livro livro = livroService.retornaLivro(id);

        return ResponseEntity.ok(new LivroResponseDTO(livro.getId(), livro.getTitulo(),
                livro.getAutor(), livro.getIsbn(), livro.getDataPublicacao(), livro.getCategoria()));
    }

    @PostMapping("/google")
    public ResponseEntity<LivroResponseDTO> criarLivroGoogleBooks(@RequestParam String isbn){

        Livro livroNovo = livroService.criaLivroGoogle(isbn);

        return ResponseEntity.status(HttpStatus.CREATED).body(new LivroResponseDTO(livroNovo.getId(), livroNovo.getTitulo(),
                livroNovo.getAutor(), livroNovo.getIsbn(), livroNovo.getDataPublicacao(), livroNovo.getCategoria()));
    }

    @GetMapping("/google")
    public ResponseEntity<List<LivroResponseDTO>> retornaLivroPorTituloGoogleBooks(@RequestParam String titulo){

        List<Livro> livros = livroService.retornaLivrosGooglePorTitulo(titulo);

        List<LivroResponseDTO> responseDTO = livros.stream().map(livro -> new LivroResponseDTO(
                null,
                livro.getTitulo(),
                livro.getAutor(),
                livro.getIsbn(),
                livro.getDataPublicacao(),
                livro.getCategoria()
        )).toList();

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivroResponseDTO> atualizaLivro(@PathVariable Long id, @Valid @RequestBody LivroRequestDTO requestDTO){

        Livro livroParaAtualizar = livroService.atualizaLivro(id, requestDTO);

        return ResponseEntity.ok(new LivroResponseDTO(livroParaAtualizar.getId(), livroParaAtualizar.getTitulo(),
                livroParaAtualizar.getAutor(), livroParaAtualizar.getIsbn(), livroParaAtualizar.getDataPublicacao(), livroParaAtualizar.getCategoria()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaLivro(@PathVariable Long id){
        livroService.deletaLivro(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
