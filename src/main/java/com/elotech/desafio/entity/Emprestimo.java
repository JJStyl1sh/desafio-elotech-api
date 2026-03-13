package com.elotech.desafio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_emprestimos")
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O ID do usuário é obrigatório")
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


    @NotNull(message = "O ID do livro é obrigatório")
    @ManyToOne
    @JoinColumn(name = "livro_id", nullable = false)
    private Livro livro;

    @Column(name = "data_emprestimo")
    @NotNull(message = "Data do emprestimo é obrigatória")
    private Date dataEmprestimo;

    @Column(name = "data_devolucao")
    @NotNull(message = "Data da devolução é obrigatória")
    private Date dataDevolucao;

    @Column(name = "status")
    @NotBlank(message = "Status é obrigatório")
    private String status;



}
