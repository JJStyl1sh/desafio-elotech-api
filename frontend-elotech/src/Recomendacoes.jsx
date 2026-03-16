import { useEffect, useState } from 'react';

export default function Recomendacoes() {
  const [usuarios, setUsuarios] = useState([]);
  const [idSelecionado, setIdSelecionado] = useState('');
  const [livrosRecomendados, setLivrosRecomendados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data.content || []));
  }, []);

  const buscarRecomendacoes = () => {
    if (!idSelecionado) return;
    fetch(`http://localhost:8081/livros/recomendacoes/${idSelecionado}`)
      .then(res => res.json())
      .then(data => setLivrosRecomendados(data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Sistema de Recomendação Inteligente</h2>
      <p>Selecione um usuário para ver livros sugeridos com base no seu histórico:</p>

      <div style={{ marginBottom: '20px' }}>
        <select value={idSelecionado} onChange={e => setIdSelecionado(e.target.value)} style={{ padding: '5px', marginRight: '10px' }}>
          <option value="">Selecione um Usuário...</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
        <button onClick={buscarRecomendacoes}>Gerar Recomendações</button>
      </div>

      <div>
        {livrosRecomendados.length > 0 ? (
          <ul style={{ listStyleType: 'square' }}>
            {livrosRecomendados.map((l, i) => (
              <li key={i}>
                <strong>{l.titulo}</strong> - {l.autor} ({l.categoria})
              </li>
            ))}
          </ul>
        ) : idSelecionado && <p>Nenhuma recomendação encontrada para este perfil ou usuário sem histórico.</p>}
      </div>
    </div>
  );
}