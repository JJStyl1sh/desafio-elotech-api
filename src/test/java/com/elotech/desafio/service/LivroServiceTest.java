package com.elotech.desafio.service;

import com.elotech.desafio.dto.GoogleBookResponseDTO;
import com.elotech.desafio.dto.LivroRequestDTO;
import com.elotech.desafio.entity.Livro;
import com.elotech.desafio.repository.LivroRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LivroServiceTest {

    @Mock
    private LivroRepository livroRepository;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private RestClient googleBooksClient;

    @InjectMocks
    private LivroService livroService;

    @Test
    void deveCriarLivroComSucesso(){

        LivroRequestDTO requestDTO = new LivroRequestDTO("O Senhor dos Anéis", "J.R.R. Tolkien", "9788533613379", LocalDate.of(1954,07,29), "Fantasia");

        Livro livroBD = Livro.builder().id(1L).titulo("O Senhor dos Anéis").autor("J.R.R. Tolkien")
                .isbn("9788533613379").dataPublicacao(LocalDate.of(1954,07,29)).categoria("Fantasia").build();

        when(livroRepository.save(any(Livro.class))).thenReturn(livroBD);

        Livro livroPraSalvar = livroService.criarLivro(requestDTO);

        assertEquals(livroBD.getIsbn(), livroPraSalvar.getIsbn());

        verify(livroRepository, times(1)).save(any(Livro.class));
    }


    @Test
    void deveRetornarLivroQuandoEncontrado(){

        Livro livroBD = Livro.builder().id(1L).titulo("O Senhor dos Anéis").autor("J.R.R. Tolkien")
                .isbn("9788533613379").dataPublicacao(LocalDate.of(1954,07,29)).categoria("Fantasia").build();

        when(livroRepository.findById(anyLong())).thenReturn(Optional.of(livroBD));

        Livro livroEncontrado = livroService.retornaLivro(1L);

        assertEquals(livroBD.getId(), livroEncontrado.getId());

        verify(livroRepository, times(1)).findById(anyLong());
    }

    @Test
    void deveRetornarExcecaoQuandoLivroNaoEncontrado(){

        when(livroRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> livroService.retornaLivro(1L));

        assertEquals("Livro não encontrado", exception.getMessage());

        verify(livroRepository, times(1)).findById(anyLong());
    }

    @Test
    void deveAtualizarLivroComSucesso(){
        LivroRequestDTO requestDTO = new LivroRequestDTO("O Senhor dos Anéis", "J.R.R. Tolkien", "9999533613379", LocalDate.of(1954,07,29), "Fantasia");

        Livro livroBD = Livro.builder().id(1L).titulo("O Senhor dos Anéis").autor("J.R.R. Tolkien")
                .isbn("9788533613379").dataPublicacao(LocalDate.of(1954,07,29)).categoria("Fantasia").build();

        when(livroRepository.findById(anyLong())).thenReturn(Optional.of(livroBD));
        when(livroRepository.save(any(Livro.class))).thenReturn(livroBD);

        Livro livroPraEditar = livroService.atualizaLivro(1L, requestDTO);

        assertEquals(requestDTO.isbn(), livroPraEditar.getIsbn());

        verify(livroRepository, times(1)).findById(anyLong());

        verify(livroRepository, times(1)).save(any(Livro.class));
    }

    @Test
    void deveExcluirLivroComSucesso(){

        Livro livroBD = Livro.builder().id(1L).titulo("O Senhor dos Anéis").autor("J.R.R. Tolkien")
                .isbn("9788533613379").dataPublicacao(LocalDate.of(1954,07,29)).categoria("Fantasia").build();

        when(livroRepository.findById(anyLong())).thenReturn(Optional.of(livroBD));

        livroService.deletaLivro(1L);

        verify(livroRepository, times(1)).delete(any(Livro.class));

    }

    @Test
    void deveCriarLivroGoogleBooksComSucesso(){

        GoogleBookResponseDTO responseFalsa = geraGoogleBookResponseDtoFalsa();

        Livro livroBD = Livro.builder().id(1L).titulo("O Senhor dos Anéis").autor("J.R.R. Tolkien")
                .isbn("9788533613379").dataPublicacao(LocalDate.of(1954,07,29)).categoria("Fantasia").build();

        when(googleBooksClient.get().uri(eq("/volumes?q={query}&key={key}"), anyString(), anyString())
                .retrieve().body(GoogleBookResponseDTO.class)).thenReturn(responseFalsa);

        when(livroRepository.save(any(Livro.class))).thenReturn(livroBD);

        Livro livroGoogle = livroService.criaLivroGoogle("9788533613379");

        assertEquals("O Senhor dos Anéis", livroGoogle.getTitulo());
        assertEquals("J.R.R. Tolkien", livroGoogle.getAutor());

        verify(livroRepository, times(1)).save(any(Livro.class));
    }

    @Test
    void deveRetornarExcecaoNaCriacaoAoNaoEncontrarLivroGoogleBooks(){

        GoogleBookResponseDTO responseFalsa= new GoogleBookResponseDTO(null);

        when(googleBooksClient.get().uri(eq("/volumes?q={query}&key={key}"), anyString(), anyString())
                .retrieve().body(GoogleBookResponseDTO.class)).thenReturn(responseFalsa);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> livroService.criaLivroGoogle("9788533613379"));

        assertEquals("Nenhum livro encontrado", exception.getMessage());

        verify(livroRepository, never()).save(any(Livro.class));

    }

    @Test
    void deveRetornarListaDeLivroGoogleBooksComSucesso(){

        GoogleBookResponseDTO responseFalsa = geraGoogleBookResponseDtoFalsa();

        when(googleBooksClient.get().uri(eq("/volumes?q={query}&key={key}"), anyString(), anyString())
                .retrieve().body(GoogleBookResponseDTO.class)).thenReturn(responseFalsa);

        List<Livro> livrosRetornados = livroService.retornaLivrosGooglePorTitulo("Senhor");

        assertEquals(1, livrosRetornados.size());
        assertEquals("O Senhor dos Anéis", livrosRetornados.getFirst().getTitulo());

    }

    @Test
    void deveRetornarListaVaziaQuandoNenhumLivroGoogleBooksForEncontrado(){
        GoogleBookResponseDTO responseFalsa = new GoogleBookResponseDTO(null);

        when(googleBooksClient.get().uri(eq("/volumes?q={query}&key={key}"), anyString(), anyString())
                .retrieve().body(GoogleBookResponseDTO.class)).thenReturn(responseFalsa);

        List<Livro> livrosRetornados = livroService.retornaLivrosGooglePorTitulo("Senhor");

        assertTrue(livrosRetornados.isEmpty());
    }

    @BeforeEach
    void geraChave(){
        ReflectionTestUtils.setField(livroService, "apiKey", "chave-falsa");
    }

    private GoogleBookResponseDTO geraGoogleBookResponseDtoFalsa(){

        List<GoogleBookResponseDTO.IndustryIdentifierDTO> identifiers = List.of(
                new GoogleBookResponseDTO.IndustryIdentifierDTO("ISBN_13", "9788533613379"),
                new GoogleBookResponseDTO.IndustryIdentifierDTO("ISBN_10", "8533613377")
        );

        GoogleBookResponseDTO.VolumeInfoDTO volumeInfo = new GoogleBookResponseDTO.VolumeInfoDTO(
                "O Senhor dos Anéis",
                List.of("J.R.R. Tolkien"),
                "1954-07-29",
                List.of("Fantasia"),
                identifiers
        );

        GoogleBookResponseDTO.ItemDTO item = new GoogleBookResponseDTO.ItemDTO(volumeInfo);

        return new GoogleBookResponseDTO(List.of(item));

    }

}