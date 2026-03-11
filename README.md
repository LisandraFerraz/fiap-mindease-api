## Configurando o Back-end (API NestJS)

O MindEase WEB e Mobile depende de uma API NestJS com MongoDB. Siga os passos abaixo para rodá-la localmente.

### Pré-requisitos

- Node.js 18+
- MongoDB instalado e rodando localmente (`mongod`)

### 1. Clonar o repositório da API

```bash
git clone https://github.com/LisandraFerraz/fiap-mindease-api.git
cd fiap-mindease-api
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Instalar o Mongoose

```bash
npm install @nestjs/mongoose mongoose
```

### 4. Configurar a conexão com o MongoDB

Crie um arquivo `.env` na raiz do projeto da API com a string de conexão:

```env
MONGODB_URI=mongodb://localhost:27017/mindease
```

Certifique-se de que o módulo `MongooseModule` está importado no `AppModule` apontando para essa variável de ambiente:

```ts
// app.module.ts
MongooseModule.forRoot(process.env.MONGODB_URI);
```

### 5. Iniciar o MongoDB

Verifique se o MongoDB está rodando localmente antes de subir a API:

```bash
# Linux/macOS
mongod

# Windows (caso instalado como serviço)
net start MongoDB
```

### 6. Rodar a API

```bash
# Modo desenvolvimento (com hot reload)
npm run start:dev

# Modo produção
npm run start:prod
```

