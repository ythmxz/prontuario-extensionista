# Prontuário Extensionista

Sistema de prontuário eletrônico extensionista desenvolvido para integrar dados das ações extensionistas realizadas pelo NJBV.

## Ferramentas

- Node.js >= 18
- pnpm 9.x (via Corepack ou instalador do pnpm)
- PostgreSQL (local ou remoto)

## Variáveis de ambiente

Crie um arquivo `.env` em `apps/api` com a variável abaixo:

```
DATABASE_URL=postgresql://USER:SENHA@HOST:PORT/NOME_DO_BANCO
```

## Instalação

```bash
pnpm install
```

## Preparação do banco (Prisma)

```bash
pnpm --filter api prisma migrate dev
```

## Execução

```bash
pnpm --filter api dev
```

## Instruções por sistema operacional

### Linux

```bash
# habilite o pnpm (opcional, via Corepack)
corepack enable
corepack prepare pnpm@9.0.0 --activate

# instale as dependências
pnpm install

# configure o banco
cat <<'EOF' > apps/api/.env
DATABASE_URL=postgresql://USER:SENHA@HOST:PORT/NOME_DO_BANCO
EOF
# edite o arquivo e ajuste DATABASE_URL

# aplique as migrations
pnpm --filter api prisma migrate dev

# rode a API
pnpm --filter api dev
```

### Windows (PowerShell)

```powershell
# habilite o pnpm (opcional, via Corepack)
corepack enable
corepack prepare pnpm@9.0.0 --activate

# instale as dependências
pnpm install

# configure o banco
@'
DATABASE_URL=postgresql://USER:SENHA@HOST:PORT/NOME_DO_BANCO
'@ | Set-Content -Path apps/api/.env
# edite o arquivo e ajuste DATABASE_URL

# aplique as migrations
pnpm --filter api prisma migrate dev

# rode a API
pnpm --filter api dev
```
