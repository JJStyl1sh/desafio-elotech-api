package com.elotech.desafio.repository;

import com.elotech.desafio.entity.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

    List<Livro> findByCategoriaInAndIdNotIn(List<String> categorias, List<Long> idLivrosEmprestados);

}
