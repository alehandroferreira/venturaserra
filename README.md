# Rastreamento de Cargas API

Ola! Este projeto e uma API REST para rastreamento de cargas com clientes, operadores, viagens e historico de movimentacoes. A ideia e facilitar o controle do ciclo de vida de uma carga, com uma documentacao Swagger pronta para testar tudo pelo navegador.

## Requisitos

- Node.js 20 (veja a versao em .nvmrc)
- Docker e Docker Compose
- npm

## Rodando localmente (passo a passo)

1. **Suba o banco com Docker**

```bash
docker-compose up -d
```

2. **Crie o arquivo de ambiente**

Copie o exemplo e ajuste se quiser:

```bash
cp .env.example .env
```

O valor de `JWT_SECRET` precisa existir. Se quiser gerar um novo:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. **Instale as dependencias**

```bash
npm install
```

4. **Prepare o Prisma (migracao e client)**

```bash
npm run prisma:migrate
npm run prisma:generate
```

Se quiser dados de exemplo:

```bash
npm run prisma:seed
```

5. **Suba a API**

```bash
npm run dev
```

Pronto! A API vai subir em `http://localhost:3000`.

- Swagger: `http://localhost:3000/docs`
- Health check: `http://localhost:3000/health`

## Testando via Swagger

A doc do Swagger ja esta com os schemas e parametros. O fluxo mais simples para testar:

1. **Abra o Swagger**

Acesse `http://localhost:3000/docs` no navegador.

2. **Crie ou use um operador**

Se voce ja tem dados seedados, pode usar um operador existente. Caso nao tenha, use o endpoint de operadores para criar um novo. Depois disso, faca login.

3. **Autentique**

No endpoint de login (`/auth/login`), envie email e senha. O retorno traz um token JWT.

4. **Use o token**

No Swagger, clique em **Authorize** e cole o token no formato:

```
Bearer SEU_TOKEN_AQUI
```

Agora os endpoints protegidos estao liberados.

5. **Teste o fluxo de rastreamento**

Sugestao de caminho feliz:

- Crie um cliente
- Crie uma viagem (tracking)
- Atualize status ou localizacao
- Marque entrega
- Consulte historico

Se quiser, use os endpoints do Swagger para ver o schema exato de cada request.

## Testes automatizados

```bash
npm test
```

---

Se algo travar, me chama que a gente resolve junto.
