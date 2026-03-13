package com.elotech.desafio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_livros")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column
    @NotBlank(message = "Titulo é obrigatório")
    private String titulo;

    @Column
    @NotBlank(message = "Autor é obrigatório")
    private String autor;

    @Column(name = "data_publicacao")
    @NotNull(message = "Data da publicação é obrigatória")
    private Date dataPublicacao;

    @Column
    @NotBlank(message = "Categoria é obrigatória")
    private String categoria;

    @OneToMany(mappedBy = "livro")
    private List<Emprestimo> emprestimos;
}
