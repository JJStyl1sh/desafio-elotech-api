import { useEffect, useState } from 'react';

export default function EmprestimosList() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [livros, setLivros] = useState([]);
  
  const [idUsuario, setIdUsuario] = useState('');
  const [idLivro, setIdLivro] = useState('');

  const [emprestimoEmEdicao, setEmprestimoEmEdicao] = useState(null);
  const [status, setStatus] = useState('EMPRESTADO');
  const [dataDevolucao, setDataDevolucao] = useState('');

  const carregarTudo = () => {
    fetch('http://localhost:8081/emprestimos').then(res => res.json()).then(data => setEmprestimos(data.content || []));
    fetch('http://localhost:8081/usuarios').then(res => res.json()).then(data => setUsuarios(data.content || []));
    fetch('http://localhost:8081/livros').then(res => res.json()).then(data => setLivros(data.content || []));
  };

  useEffect(() => { carregarTudo(); }, []);

  const salvarOuAtualizarEmprestimo = async (e) => {
    e.preventDefault();
    
    const payload = emprestimoEmEdicao 
      ? { 
          dataDevolucao: dataDevolucao, 
          status: status 
        }
      : { 
          usuarioId: parseInt(idUsuario), 
          livroId: parseInt(idLivro) 
        };
    
    const url = emprestimoEmEdicao 
      ? `http://localhost:8081/emprestimos/${emprestimoEmEdicao}` 
      : 'http://localhost:8081/emprestimos';
      
    const method = emprestimoEmEdicao ? 'PUT' : 'POST';

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
          alert("Erro do Backend: " + (errorJson.message || errorJson.erro || errorJson.error || errorText));
        } catch {
          alert("Erro do Backend: " + errorText);
        }
        return;
      }

      carregarTudo();
      cancelarEdicao();
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  };

  const prepararEdicao = (emp) => {
    setEmprestimoEmEdicao(emp.id);
    setStatus(emp.status);
    setDataDevolucao(emp.dataDevolucao || ''); 
  };

  const cancelarEdicao = () => {
    setEmprestimoEmEdicao(null);
    setIdUsuario(''); 
    setIdLivro(''); 
    setStatus('EMPRESTADO');
    setDataDevolucao('');
  };

  return (
    <div>
      <h2>Gerenciar Empréstimos</h2>
      
      <form onSubmit={salvarOuAtualizarEmprestimo} style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
        
        {!emprestimoEmEdicao ? (
          <>
            <select value={idUsuario} onChange={e => setIdUsuario(e.target.value)} required style={{ marginRight: '5px' }}>
              <option value="">Selecione o Usuário...</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
            
            <select value={idLivro} onChange={e => setIdLivro(e.target.value)} required style={{ marginRight: '5px' }}>
              <option value="">Selecione o Livro...</option>
              {livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
            </select>
            <button type="submit">Registrar Empréstimo</button>
          </>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '15px' }}>
            <span style={{ fontWeight: 'bold', paddingBottom: '3px' }}>
              Editando #{emprestimoEmEdicao}
            </span>
            
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px' }}>
              Data de Devolução
              <input 
                type="date" 
                value={dataDevolucao} 
                onChange={e => setDataDevolucao(e.target.value)} 
                required 
                style={{ marginTop: '3px' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px' }}>
              Status
              <select value={status} onChange={e => setStatus(e.target.value)} required style={{ marginTop: '3px' }}>
                <option value="EMPRESTADO">EMPRESTADO</option>
                <option value="DEVOLVIDO">DEVOLVIDO</option>
              </select>
            </label>
            
            <div>
              <button type="submit">Confirmar Edição</button>
              <button type="button" onClick={cancelarEdicao} style={{ marginLeft: '5px' }}>Cancelar</button>
            </div>
          </div>
        )}
      </form>

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário (ID)</th>
            <th>Livro (ID)</th>
            <th>Data Empréstimo</th>
            <th>Data Devolução</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {emprestimos.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.userId || emp.idUsuario || emp.usuarioId}</td>
              <td>{emp.livroId || emp.idLivro}</td>
              <td>{emp.dataEmprestimo}</td>
              <td>{emp.dataDevolucao}</td>
              <td>{emp.status}</td>
              <td>
                <button onClick={() => prepararEdicao(emp)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}