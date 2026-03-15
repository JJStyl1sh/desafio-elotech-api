package com.elotech.desafio.service;

import com.elotech.desafio.entity.Livro;
import com.elotech.desafio.repository.LivroRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class LivroServiceTest {

    @Mock
    private LivroRepository livroRepository;

    @Mock
    private RestClient restClient;

    @InjectMocks
    private LivroService livroService;

    @Test
    void deveCriarLivroComSucesso(){}

    @Test
    void deveRetornarLivroComSucesso(){}

    @Test
    void deveRetornarLivroQuandoEncontrado(){}

    @Test
    void deveRetornarExcecaoQuandoLivroNaoEncontrado(){}

    @Test
    void deveAtualizarLivroComSucesso(){}

    @Test
    void deveExcluirLivroComSucesso(){}

    @Test
    void deveCriarLivroGoogleBooksComSucesso(){}

    @Test
    void deveRetornarExcecaoNaCriacaoAoNaoEncontrarLivroGoogleBooks(){}

    @Test
    void deveRetornarListaDeLivroGoogleBooksComSucesso(){}

    @Test
    void deveRetornarListaVaziaQuandoNenhumLivroGoogleBooksForEncontrado(){}

}