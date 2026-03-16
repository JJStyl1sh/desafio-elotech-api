import { useEffect, useState } from 'react';

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const carregarUsuarios = () => {
    fetch('http://localhost:8081/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data.content || []));
  };

  useEffect(() => { carregarUsuarios(); }, []);

  const salvarOuAtualizarUsuario = async (e) => {
    e.preventDefault();
    const payload = { nome, email, telefone };
    
    const url = usuarioEmEdicao 
      ? `http://localhost:8081/usuarios/${usuarioEmEdicao}` 
      : 'http://localhost:8081/usuarios';
      
    const method = usuarioEmEdicao ? 'PUT' : 'POST';

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

      carregarUsuarios();
      cancelarEdicao(); 
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  };

  const prepararEdicao = (usuario) => {
    setUsuarioEmEdicao(usuario.id);
    setNome(usuario.nome);
    setEmail(usuario.email);
    setTelefone(usuario.telefone);
  };

  const cancelarEdicao = () => {
    setUsuarioEmEdicao(null);
    setNome(''); setEmail(''); setTelefone('');
  };

  const deletarUsuario = async (id) => {
    try {
      const res = await fetch(`http://localhost:8081/usuarios/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert("Não é possível excluir este usuário. Verifique se ele possui empréstimos vinculados.");
        return;
      }
      carregarUsuarios();
    } catch (err) {
      alert("Erro de conexão ao tentar excluir.");
    }
  };
  return (
    <div>
      <h2>Gerenciar Usuários</h2>
      
      
      <form onSubmit={salvarOuAtualizarUsuario} style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        
        <button type="submit">{usuarioEmEdicao ? 'Atualizar Usuário' : 'Salvar Novo Usuário'}</button>
        {usuarioEmEdicao && <button type="button" onClick={cancelarEdicao} style={{ marginLeft: '5px' }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Ações</th></tr></thead>
        <tbody>
          {usuarios.map(u => (
             <tr key={u.id}>
              <td>{u.id}</td><td>{u.nome}</td><td>{u.email}</td><td>{u.telefone}</td>
              <td>
                <button onClick={() => prepararEdicao(u)} style={{ marginRight: '5px' }}>Editar</button>
                <button onClick={() => deletarUsuario(u.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}