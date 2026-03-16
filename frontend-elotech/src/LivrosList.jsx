import { useEffect, useState } from 'react';

export default function LivrosList() {
  const [livros, setLivros] = useState([]);
  
  const [livroEmEdicao, setLivroEmEdicao] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [categoria, setCategoria] = useState('');

  const carregarLivros = () => {
    fetch('http://localhost:8081/livros')
      .then(res => res.json())
      .then(data => setLivros(data.content || []));
  };

  useEffect(() => { carregarLivros(); }, []);

  const salvarOuAtualizarLivro = async (e) => {
    e.preventDefault();
    const payload = { titulo, autor, isbn, categoria, dataPublicacao: new Date().toISOString().split('T')[0] };
    
    const url = livroEmEdicao 
      ? `http://localhost:8081/livros/${livroEmEdicao}` 
      : 'http://localhost:8081/livros';
      
    const method = livroEmEdicao ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          alert("Erro: " + (errorJson.message || errorJson.erro || errorJson.error || errorText));
        } catch {
          alert("Erro: " + errorText);
        }
        return;
      }

      carregarLivros();
      cancelarEdicao(); 
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  };

  const prepararEdicao = (livro) => {
    setLivroEmEdicao(livro.id);
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setIsbn(livro.isbn);
    setCategoria(livro.categoria);
  };

  const cancelarEdicao = () => {
    setLivroEmEdicao(null);
    setTitulo(''); setAutor(''); setIsbn(''); setCategoria('');
  };

  const deletarLivro = (id) => {
    fetch(`http://localhost:8081/livros/${id}`, { method: 'DELETE' })
      .then(() => carregarLivros());
  };

  return (
    <div>
      <h2>Catálogo de Livros</h2>
      
      {}
      <form onSubmit={salvarOuAtualizarLivro} style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
        <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
        <input placeholder="Autor" value={autor} onChange={e => setAutor(e.target.value)} required />
        <input placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} required />
        <input placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required />
        
        <button type="submit">{livroEmEdicao ? 'Atualizar Livro' : 'Salvar Novo Livro'}</button>
        {livroEmEdicao && <button type="button" onClick={cancelarEdicao} style={{ marginLeft: '5px' }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.titulo}</td>
              <td>{l.autor}</td>
              <td>{l.isbn}</td>
              <td>{l.categoria}</td>
              <td>
                <button onClick={() => prepararEdicao(l)} style={{ marginRight: '5px' }}>Editar</button>
                <button onClick={() => deletarLivro(l.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}