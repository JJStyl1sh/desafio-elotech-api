# Desafio Tecnico Elotech - Sistema de Biblioteca

**Autor:** Joao Fernando Ehlers

Sistema completo para gestao de biblioteca com emprestimos, devolucoes e recomendacoes de livros.

## Stack

- **Backend:** Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL
- **Frontend:** React 18 + Vite
- **Infra:** Docker, Docker Compose, Nginx

---

## Como rodar

### Com Docker (recomendado)

1. Configure sua chave do Google Books no `docker-compose.yml`:
```yaml
- GOOGLE_BOOKS_API_KEY=sua_chave_aqui
```

2. Suba tudo:
```bash
docker-compose up --build
```

3. Acesse:
    - Frontend: http://localhost:5173
    - API: http://localhost:8081

### Sem Docker

Backend:
```bash
mvn spring-boot:run
```

Frontend:
```bash
cd frontend-elotech && npm install && npm run dev
```

---

## Banco de Dados

Tres tabelas principais:

**usuarios**
- id, nome, email (formato valido), data_cadastro (nao pode ser futura), telefone

**livros**
- id, titulo, autor, isbn (unico), data_publicacao, categoria

**emprestimos**
- id, usuario_id (FK), livro_id (FK), data_emprestimo, data_devolucao, status

Relacionamento: Usuario 1:N Emprestimos N:1 Livro

---

## Validacoes implementadas

- Email precisa ter formato valido
- Data de cadastro do usuario nao pode ser no futuro
- Data de emprestimo nao pode ser no futuro
- Um livro so pode ter UM emprestimo ativo por vez (impede duplicidade)
- Campos obrigatorios validados em todas as entidades

---

## API - Endpoints

### Usuarios `/usuarios`
- `GET /usuarios` - lista paginada
- `GET /usuarios/{id}` - busca por id
- `POST /usuarios` - cria
- `PUT /usuarios/{id}` - atualiza
- `DELETE /usuarios/{id}` - remove

### Livros `/livros`
- `GET /livros` - lista paginada
- `GET /livros/{id}` - busca por id
- `POST /livros` - cria
- `PUT /livros/{id}` - atualiza
- `DELETE /livros/{id}` - remove
- `GET /livros/google?titulo=xxx` - busca no Google Books
- `POST /livros/google?isbn=xxx` - adiciona livro do Google Books
- `GET /livros/recomendacoes/{usuarioId}` - recomendacoes por categoria

### Emprestimos `/emprestimos`
- `GET /emprestimos` - lista paginada
- `POST /emprestimos` - registra (body: usuarioId, livroId)
- `PUT /emprestimos/{id}` - atualiza status/devolucao

---

## Recomendacoes

O endpoint `/livros/recomendacoes/{usuarioId}` retorna livros baseados nas categorias que o usuario ja pegou emprestado. Filtra os que ele ainda nao leu.

Obs: categorias do Google Books podem variar ("Fiction" vs "Literary Fiction"), entao as recomendacoes dependem de correspondencia exata.

---

## Integracao Google Books

Busca livros pela API do Google e permite adicionar direto na biblioteca local. A chave de API nao esta no repositorio por seguranca - configure no docker-compose ou application.properties.

Tratamento de datas parciais: quando a API retorna so ano ou ano-mes, normalizo pro primeiro dia do periodo.

---

## Testes

```bash
mvn test
```

Cobertura dos services principais (UsuarioService, LivroService, EmprestimoService) com JUnit 5 e Mockito.

---

## Decisoes tecnicas

- Usei paginacao em todos os endpoints de listagem pra escalar melhor
- Separei bem as camadas (controller -> service -> repository)
- DTOs separados pra request/response
- Tratamento global de excecoes com mensagens claras
- Frontend simples em React puro sem frameworks de UI pra manter leve
