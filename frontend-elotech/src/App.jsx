import { useState } from 'react';
import LivrosList from './LivrosList';
import UsuariosList from './UsuariosList';
import EmprestimosList from './EmprestimosList';
import GoogleBooksSearch from './GoogleBooksSearch';

export default function App() {
  const [aba, setAba] = useState('livros');

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Biblioteca Elotech (Admin)</h1>
      
      {}
      <nav style={{ marginBottom: '20px', paddingBottom: '10px' }}>
        <button onClick={() => setAba('livros')} style={{ fontWeight: aba === 'livros' ? 'bold' : 'normal' }}>
          Livros Locais
        </button>
        
        <button onClick={() => setAba('google')} style={{ marginLeft: '10px', fontWeight: aba === 'google' ? 'bold' : 'normal' }}>
          Buscar no Google Books
        </button>
        
        <button onClick={() => setAba('usuarios')} style={{ marginLeft: '10px', fontWeight: aba === 'usuarios' ? 'bold' : 'normal' }}>
          Usuários
        </button>
        
        <button onClick={() => setAba('emprestimos')} style={{ marginLeft: '10px', fontWeight: aba === 'emprestimos' ? 'bold' : 'normal' }}>
          Empréstimos
        </button>
      </nav>
      
      <hr />
      
      <main style={{ marginTop: '20px' }}>
        {aba === 'livros' && <LivrosList />}
        {aba === 'google' && <GoogleBooksSearch />}
        {aba === 'usuarios' && <UsuariosList />}
        {aba === 'emprestimos' && <EmprestimosList />}
      </main>
    </div>
  );
}