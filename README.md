# 🛍️ Deluxe Parfum - E-commerce de Perfumes Premium

Sistema completo de e-commerce para perfumaria com painel administrativo, gestão de estoque de produção e controle financeiro.

## 🚀 Funcionalidades

### Área Pública (Clientes)
- ✅ Catálogo de produtos elegante
- ✅ Página de produto com detalhes completos
- ✅ Carrinho de compras
- ✅ Sistema de checkout
- ✅ Cadastro e login de clientes
- ✅ Área do cliente com histórico de pedidos

### Painel Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gestão completa de produtos
- ✅ Controle de pedidos e status
- ✅ Gerenciamento de clientes
- ✅ Estoque de produção (essências, álcool, frascos, bases)
- ✅ Sistema de produção com baixa automática de materiais
- ✅ Controle financeiro e pagamentos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta gratuita no MongoDB Atlas
- npm ou yarn

## 🗄️ Configurar MongoDB Atlas (100% Gratuito)

### 1. Criar conta no MongoDB Atlas

1. Acesse https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita (pode usar Google)
3. Escolha o plano **FREE** (M0 Sandbox) - 512MB grátis para sempre

### 2. Criar um Cluster

1. Após login, clique em "Build a Database"
2. Escolha **M0 FREE**
3. Escolha a região mais próxima (ex: São Paulo - aws)
4. Dê um nome ao cluster (ex: "Cluster0")
5. Clique em "Create"

### 3. Configurar Acesso

**Criar usuário do banco:**
1. Em "Security" → "Database Access"
2. Clique em "Add New Database User"
3. Escolha "Password"
4. Defina username e password (anote isso!)
5. Em "Database User Privileges", escolha "Read and write to any database"
6. Clique em "Add User"

**Liberar acesso de qualquer IP:**
1. Em "Security" → "Network Access"
2. Clique em "Add IP Address"
3. Clique em "Allow Access from Anywhere" (0.0.0.0/0)
4. Clique em "Confirm"

### 4. Obter a Connection String

1. Volte para "Database"
2. Clique em "Connect" no seu cluster
3. Escolha "Connect your application"
4. Copie a connection string (formato: `mongodb+srv://...`)
5. Substitua `<password>` pela senha que você criou
6. Substitua `myFirstDatabase` por `deluxe_parfum`

Exemplo:
```
mongodb+srv://usuario:senha123@cluster0.abc123.mongodb.net/deluxe_parfum?retryWrites=true&w=majority
```

## 🔧 Instalação Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Cole aqui a connection string do MongoDB Atlas
DATABASE_URL="mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/deluxe_parfum?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-secret-aleatorio-aqui"
```

**IMPORTANTE**: Para gerar um `NEXTAUTH_SECRET` seguro, execute:
```bash
openssl rand -base64 32
```

### 3. Configurar o banco de dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Sincronizar o schema com o MongoDB
npx prisma db push

# Popular o banco com dados de exemplo
npx prisma db seed
```

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 👤 Credenciais de Acesso

### Admin
- Email: `admin@deluxeparfum.com`
- Senha: `admin123`

Acesse o painel admin em: http://localhost:3000/admin

## 🌐 Deploy na Vercel (100% Gratuito)

### 1. Preparar o projeto

Primeiro, suba seu código para o GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/deluxe-parfum.git
git push -u origin main
```

### 2. Deploy na Vercel

**Opção A: Pelo site (mais fácil)**

1. Acesse https://vercel.com e faça login com GitHub
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente:
   - `DATABASE_URL`: Cole sua connection string do MongoDB Atlas
   - `NEXTAUTH_URL`: Deixe em branco (Vercel preenche automaticamente)
   - `NEXTAUTH_SECRET`: Cole o secret gerado com `openssl rand -base64 32`
5. Clique em "Deploy"

**Opção B: Pela CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Adicionar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

### 3. Configurar banco de produção

Após o primeiro deploy, configure o banco:

```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar schema
npx prisma db push

# Popular o banco
npx prisma db seed
```

### 4. Acessar o site

Seu site estará disponível em: `https://seu-projeto.vercel.app`

## 💰 Custos

**TUDO 100% GRATUITO:**
- ✅ MongoDB Atlas: Plano Free (512MB)
- ✅ Vercel: Plano Hobby (deploy ilimitado)
- ✅ Sem custo de hospedagem
- ✅ Sem custo de banco de dados
- ✅ Sem cartão de crédito necessário

## 📱 Estrutura do Projeto

```
deluxe-parfum/
├── app/
│   ├── admin/              # Painel administrativo
│   │   ├── page.tsx        # Dashboard
│   │   ├── produtos/       # Gestão de produtos
│   │   ├── pedidos/        # Gestão de pedidos
│   │   ├── clientes/       # Gestão de clientes
│   │   ├── estoque/        # Estoque de produção
│   │   ├── producao/       # Controle de produção
│   │   └── financeiro/     # Controle financeiro
│   ├── api/                # APIs
│   │   └── auth/           # Autenticação
│   ├── login/              # Página de login
│   ├── cadastro/           # Página de cadastro
│   └── page.tsx            # Home pública
├── prisma/
│   ├── schema.prisma       # Schema do banco (MongoDB)
│   └── seed.ts             # Dados iniciais
├── lib/
│   └── prisma.ts           # Cliente Prisma
└── package.json
```

## 🎨 Design

- **Cores**: Preto, Dourado (#DAA520) e Branco
- **Fontes**: Montserrat (sans) + Playfair Display (serif)
- **Estilo**: Minimalista, elegante, premium

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas (gratuito) + Prisma ORM
- **Autenticação**: NextAuth.js + JWT
- **Deploy**: Vercel (gratuito)

## 📊 Banco de Dados

### Principais Collections (MongoDB)

- **User**: Usuários e clientes
- **Product**: Produtos (perfumes)
- **Order**: Pedidos
- **Payment**: Pagamentos
- **Essence**: Essências para produção
- **Alcohol**: Álcool para produção
- **Bottle**: Frascos
- **BaseFragrance**: Bases prontas
- **Production**: Registro de produção

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação JWT
- ✅ Rotas admin protegidas
- ✅ Validação de dados com Zod
- ✅ Proteção CSRF (Next.js)

## 🆘 Problemas Comuns

### Erro de conexão com MongoDB

- Verifique se a connection string está correta
- Confirme que liberou o IP 0.0.0.0/0 no Network Access
- Verifique se o usuário tem permissões corretas

### Erro ao rodar prisma db push

```bash
# Deletar node_modules e reinstalar
rm -rf node_modules
npm install

# Gerar novamente o Prisma Client
npx prisma generate
npx prisma db push
```

### Imagens não aparecem

Verifique se o domínio está configurado em `next.config.js`:

```js
images: {
  domains: ['images.unsplash.com'],
}
```

## 📞 Suporte

Para dúvidas e suporte, consulte a documentação oficial:
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas
- Vercel: https://vercel.com/docs

---

Desenvolvido com ❤️ para Deluxe Parfum - 100% Gratuito!
