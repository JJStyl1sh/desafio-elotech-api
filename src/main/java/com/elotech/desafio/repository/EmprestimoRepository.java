package com.elotech.desafio.repository;

import com.elotech.desafio.entity.Emprestimo;
import com.elotech.desafio.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    boolean existsByLivroIdAndStatus(Long livroId, String status);

    List<Emprestimo> findByUsuario(Usuario usuario);
}
