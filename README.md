# Prontuário Extensionista - NJBV

Sistema de prontuário eletrônico extensionista desenvolvido para integrar dados das ações extensionistas realizadas pelo NJBV.

## Stack

| Camada                 | Tecnologia                                              |
| ---------------------- | ------------------------------------------------------- |
| Gerenciador de pacotes | [pnpm](https://pnpm.io/)                                |
| Monorepo               | [Turborepo](https://turbo.build/repo)                   |
| Backend                | [Fastify](https://fastify.dev/)                         |
| ORM                    | [Prisma 7](https://www.prisma.io/)                      |
| Banco de dados         | [PostgreSQL 17](https://www.postgresql.org/) via Docker |
| Frontend               | [Next.js](https://nextjs.org/)                          |
| Mobile                 | [Expo](https://expo.dev/) _(em breve)_                  |

## Estrutura

```
prontuario-extensionista/
├── apps/
│   ├── api/          # Fastify + Prisma (Backend)
│   └── web/          # Next.js (Frontend)
│   └── mobile/       # Expo (Mobile, em breve)
├── packages/
│   └── tsconfig/     # Configurações TypeScript compartilhadas
├── docker-compose.yml
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Pré-requisitos

### Windows

- [Node.js](https://nodejs.org/) >= 24.16.0 LTS
- [pnpm](https://pnpm.io/installation) >= 9.x
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) com WSL2

**Instalar WSL2** (necessário para o Docker Desktop):

```powershell
# PowerShell como Administrador
wsl --install
# Reinicie o computador após a instalação
```

**Instalar pnpm:**

```powershell
npm install -g pnpm
```

### Linux

- [Node.js](https://nodejs.org/) >= 24.16.0 LTS
- [pnpm](https://pnpm.io/installation) >= 9.x
- [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

**Instalar pnpm:**

```bash
npm install -g pnpm
```

**Instalar Docker Engine (Ubuntu/Debian):**

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Faça logout e login para aplicar o grupo
```

---

## Configuração inicial

### 1. Clonar o repositório

```bash
git clone https://github.com/ythmxz/prontuario-extensionista.git
cd prontuario-extensionista
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
```

Abra `apps/api/.env` e ajuste.

> **Windows:** Se você já tiver um PostgreSQL local instalado na porta padrão (`5432`), o Docker está configurado para usar a porta `5433` para evitar conflitos.

### 4. Subir o banco de dados

```bash
docker compose up -d
```

Verifique se o container está saudável:

```bash
docker compose ps
# STATUS deve mostrar "healthy"
```

### 5. Aplicar as migrations

```bash
pnpm --filter api exec prisma migrate dev
```

### 6. Gerar o Prisma Client

```bash
pnpm --filter api exec prisma generate
```

---

## Desenvolvimento

### Rodar todos os apps

```bash
pnpm dev
```

### Rodar apenas o backend

```bash
pnpm --filter api dev
```

O servidor estará disponível em `http://localhost:3333`.

### Rodar apenas o frontend

```bash
pnpm --filter web dev
```

---

## Banco de dados

### Comandos úteis

```bash
# Criar uma nova migration após alterar o schema
pnpm --filter @prontuario-extensionista/api exec prisma migrate dev --name nome_da_migration

# Abrir o Prisma Studio (interface visual do banco)
pnpm --filter @prontuario-extensionista/api exec prisma studio

# Gerar o client após alterações no schema
pnpm --filter @prontuario-extensionista/api exec prisma generate
```

### Gerenciar o container Docker

```bash
# Subir o banco
docker compose up -d

# Parar o banco (dados preservados)
docker compose down

# Parar o banco e apagar todos os dados
docker compose down -v

# Ver logs do container
docker compose logs postgres
```

> **Atenção:** `docker compose down -v` apaga todos os dados do banco. Após rodar esse comando, execute `prisma migrate dev` novamente para recriar as tabelas.

---

## Build

```bash
# Build de todos os apps
pnpm build

# Build apenas do backend
pnpm --filter @prontuario-extensionista/api build
```

---

## Notas importantes

- O arquivo `.env` **não é versionado**. Use `.env.example` como referência.
- Ao atualizar o `schema.prisma`, sempre rode `prisma migrate dev` seguido de `prisma generate`.
- O Turborepo faz cache dos builds — se algo parecer desatualizado, rode `pnpm build --force`.

## Diagramas

### Casos de Uso

```mermaid

flowchart LR
    %% Atores
    Op(["Administrador"])
    Prof(["Profissional"])

    Prof -.->|generalização| Op

    subgraph Sistema ["Sistema Prontuário Extensionista — NJBV / UESC"]
        direction TB

        subgraph SubAuth ["Acesso e Configurações"]
            UC01(["UC01: Realizar Login (E-mail/Senha)"])
            UC02(["UC02: Criar Conta de Usuário"])
            UC03(["UC03: Gerenciar Perfil e Preferências"])
        end

        subgraph SubAcad ["Estrutura Acadêmica e Institucional"]
            UC04(["UC04: Gerenciar Departamentos, Colegiados e Cursos"])
            UC05(["UC05: Gerenciar Núcleos e Linhas de Atuação"])
            UC06(["UC06: Gerenciar Tipos e Locais de Ação"])
            UC07(["UC07: Gerenciar Alunos e Professores"])
        end

        subgraph SubExt ["Gestão de Ações Extensionistas"]
            UC08(["UC08: Cadastrar Pessoa (Base Única)"])
            UC09(["UC09: Gerenciar Membros da Equipe"])
            UC10(["UC10: Cadastrar Ações Extensionistas"])
            UC21(["UC10: Consultar Ações Extensionistas"])
            UC11(["UC11: Vincular Membro à Equipe da Ação"])
            UC12(["UC12: Registrar Participação e Frequência"])
            UC13(["UC13: Anexar e Consultar Documentos da Ação"])
        end

        subgraph SubClin ["Prontuário e Atendimento Clínico"]
            UC14(["UC14: Consultar Prontuário"])
            UC15(["UC15: Registrar Atendimento Clínico"])
            UC16(["UC16: Registrar Avaliação Física e IMC"])
            UC17(["UC17: Emitir Prescrição"])
        end

        subgraph SubGest ["Monitoramento e Relatórios"]
            UC18(["UC18: Visualizar Dashboard de Indicadores"])
            UC19(["UC19: Consultar Agenda de Atendimentos"])
            UC20(["UC20: Emitir Relatórios de Impacto Comunitário"])
        end
    end

    %% Relações Operador
    Prof  --> UC01
    Prof  --> UC02
    Prof --> UC03
    Op --> UC04
    Op --> UC05
    Op --> UC06
    Op --> UC07
    Op --> UC08
    Op --> UC09
    Op --> UC10
    Op --> UC11
    Prof --> UC12
    Prof --> UC13
    Prof --> UC18
    Prof --> UC19
    Prof --> UC20
    Prof --> UC21

    %% Relações Profissional
    Prof --> UC14
    Prof --> UC15
    Prof --> UC16
    Prof --> UC17

            

    %% Inclusões e Extensões
    UC09 -.->|"&lt;&lt;include&gt;&gt;"| UC08
    UC11 -.->|"&lt;&lt;include&gt;&gt;"| UC09
    UC11 -.->|"&lt;&lt;include&gt;&gt;"| UC10
    UC15 -.->|"&lt;&lt;include&gt;&gt;"| UC14
    UC16 -.->|"&lt;&lt;extend&gt;&gt;"| UC15
    UC17 -.->|"&lt;&lt;extend&gt;&gt;"| UC15       

```
