package com.elotech.desafio.dto;

import java.time.LocalDate;

public record LivroResponseDTO(Long id, String titulo, String autor, String isbn, LocalDate dataPublicacao, String categoria ) {

}
