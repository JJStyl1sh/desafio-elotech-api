import { useState } from 'react';

export default function GoogleBooksSearch() {
  const [tituloBusca, setTituloBusca] = useState('');
  const [resultados, setResultados] = useState([]);

  const buscarLivros = (e) => {
    e.preventDefault();
    
    fetch(`http://localhost:8081/livros/google?titulo=${tituloBusca}`)
      .then(res => res.json())
      .then(data => setResultados(data || []))
      .catch(err => console.error("Erro na busca:", err));
  };

  const importarLivro = (isbn) => {
    if (!isbn) {
      alert("Este livro não possui ISBN na API do Google para ser importado.");
      return;
    }

    fetch(`http://localhost:8081/livros/google?isbn=${isbn}`, {
      method: 'POST'
    }).then(res => {
      if (res.ok) {
        alert("Livro importado com sucesso para o seu banco de dados!");
      } else {
        alert("Erro ao importar. Verifique se o livro já existe ou se o ISBN é válido.");
      }
    }).catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Integração Google Books</h2>
      
      <form onSubmit={buscarLivros} style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
        <input 
          placeholder="Digite o título do livro..." 
          value={tituloBusca} 
          onChange={e => setTituloBusca(e.target.value)} 
          required 
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button type="submit">Pesquisar</button>
      </form>

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Data Publicação</th>
            <th>Categoria</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {resultados.length === 0 ? (
            <tr><td colSpan="6">Nenhum resultado ainda.</td></tr>
          ) : (
            resultados.map((livro, index) => (
              <tr key={index}>
                {}
                <td>{livro.titulo}</td>
                <td>{livro.autor}</td>
                <td>{livro.isbn}</td>
                <td>{livro.dataPublicacao}</td>
                <td>{livro.categoria}</td>
                <td>
                  <button onClick={() => importarLivro(livro.isbn)}>
                    Salvar no Banco
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}