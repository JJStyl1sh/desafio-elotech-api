package com.elotech.desafio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_livros")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Titulo é obrigatório")
    private String titulo;

    @Column(nullable = false)
    @NotBlank(message = "Autor é obrigatório")
    private String autor;

    @Column(nullable = false)
    @NotBlank(message = "ISBN é obrigatório")
    private String isbn;

    @Column(name = "data_publicacao", nullable = false)
    @NotNull(message = "Data da publicação é obrigatória")
    private LocalDate dataPublicacao;

    @Column(nullable = false)
    @NotBlank(message = "Categoria é obrigatória")
    private String categoria;

    @OneToMany(mappedBy = "livro")
    private List<Emprestimo> emprestimos;
}
