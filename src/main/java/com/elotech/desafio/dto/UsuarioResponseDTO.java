package com.elotech.desafio.dto;

import java.time.LocalDate;

public record UsuarioResponseDTO(Long id, String nome, String email, LocalDate dataCadastro, String telefone) {
}
