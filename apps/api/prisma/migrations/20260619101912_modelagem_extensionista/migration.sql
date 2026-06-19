-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('M', 'F', 'OUTRO');

-- CreateEnum
CREATE TYPE "ModalidadeAcao" AS ENUM ('PRESENCIAL', 'REMOTO', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "StatusAcao" AS ENUM ('PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoLocal" AS ENUM ('ESCOLA', 'UBS', 'CAMPUS', 'COMUNIDADE', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('RELATORIO', 'MATERIAL_EDUCATIVO', 'FOTO', 'VIDEO', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoMembro" AS ENUM ('COORDENADOR', 'DOCENTE', 'DISCENTE', 'VOLUNTARIO', 'TECNICO');

-- CreateEnum
CREATE TYPE "FrequenciaParticipacao" AS ENUM ('PRESENTE', 'AUSENTE', 'JUSTIFICADO');

-- CreateEnum
CREATE TYPE "TipoAtendimento" AS ENUM ('CONSULTA', 'TRIAGEM', 'ORIENTACAO', 'ACOMPANHAMENTO', 'OUTRO');

-- CreateEnum
CREATE TYPE "NivelCurso" AS ENUM ('GRADUACAO', 'ESPECIALIZACAO', 'MESTRADO', 'DOUTORADO');

-- CreateEnum
CREATE TYPE "SituacaoAluno" AS ENUM ('ATIVO', 'TRANCADO', 'FORMADO', 'EVADIDO', 'JUBILADO');

-- CreateTable
CREATE TABLE "departamento" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "sigla" VARCHAR(20) NOT NULL,

    CONSTRAINT "departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colegiado" (
    "id" SERIAL NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    "nome" VARCHAR(150) NOT NULL,

    CONSTRAINT "colegiado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curso" (
    "id" SERIAL NOT NULL,
    "colegiadoId" INTEGER NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "sigla" VARCHAR(20),
    "nivel" "NivelCurso" NOT NULL,
    "cargaHoraria" INTEGER,
    "duracaoPeriodos" INTEGER,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "matricula" VARCHAR(30) NOT NULL,
    "periodoAtual" INTEGER,
    "situacao" "SituacaoAluno" NOT NULL DEFAULT 'ATIVO',
    "dataIngresso" DATE NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    "matricula" VARCHAR(30) NOT NULL,
    "vinculo" VARCHAR(80),

    CONSTRAINT "professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleo" (
    "id" SERIAL NOT NULL,
    "departamentoId" INTEGER,
    "nome" VARCHAR(200) NOT NULL,
    "sigla" VARCHAR(20) NOT NULL,
    "objetivo" TEXT NOT NULL,
    "dataAprovacao" DATE NOT NULL,
    "resolucaoConsepe" VARCHAR(50) NOT NULL,

    CONSTRAINT "nucleo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linha_atuacao" (
    "id" SERIAL NOT NULL,
    "nucleoId" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT NOT NULL,
    "publicoFoco" VARCHAR(100) NOT NULL,

    CONSTRAINT "linha_atuacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_acao" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(80) NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "tipo_acao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local_acao" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "tipo" "TipoLocal" NOT NULL,
    "endereco" TEXT NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,

    CONSTRAINT "local_acao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acao_extensionista" (
    "id" SERIAL NOT NULL,
    "linhaAtuacaoId" INTEGER NOT NULL,
    "tipoAcaoId" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataInicio" DATE NOT NULL,
    "dataFim" DATE,
    "cargaHoraria" DECIMAL(5,1) NOT NULL,
    "modalidade" "ModalidadeAcao" NOT NULL,
    "publicoAlvo" VARCHAR(200) NOT NULL,
    "status" "StatusAcao" NOT NULL DEFAULT 'PLANEJADA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acao_extensionista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento_acao" (
    "id" SERIAL NOT NULL,
    "acaoId" INTEGER NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "arquivoUrl" TEXT NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documento_acao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa" (
    "id" SERIAL NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "telefone" VARCHAR(20),
    "email" VARCHAR(150),
    "endereco" TEXT,
    "municipio" VARCHAR(100),
    "uf" CHAR(2),

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participante" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "escolaridade" VARCHAR(80),
    "nomeResponsavel" VARCHAR(200),
    "telResponsavel" VARCHAR(20),
    "observacoes" TEXT,

    CONSTRAINT "participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membro_equipe" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "departamentoId" INTEGER,
    "tipo" "TipoMembro" NOT NULL,
    "matricula" VARCHAR(30),
    "vinculo" VARCHAR(80),

    CONSTRAINT "membro_equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipe_acao" (
    "id" SERIAL NOT NULL,
    "membroId" INTEGER NOT NULL,
    "acaoId" INTEGER NOT NULL,
    "papel" VARCHAR(80) NOT NULL,
    "dataEntrada" DATE NOT NULL,
    "dataSaida" DATE,
    "horasDedicadas" DECIMAL(6,1),

    CONSTRAINT "equipe_acao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participacao_acao" (
    "id" SERIAL NOT NULL,
    "participanteId" INTEGER NOT NULL,
    "acaoId" INTEGER NOT NULL,
    "dataParticipacao" DATE NOT NULL,
    "frequencia" "FrequenciaParticipacao" NOT NULL DEFAULT 'PRESENTE',
    "observacoes" TEXT,

    CONSTRAINT "participacao_acao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prontuario" (
    "id" SERIAL NOT NULL,
    "participanteId" INTEGER NOT NULL,
    "numeroProntuario" VARCHAR(30) NOT NULL,
    "dataAbertura" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoSanguineo" VARCHAR(5),
    "alergias" TEXT,
    "obsGerais" TEXT,

    CONSTRAINT "prontuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atendimento" (
    "id" SERIAL NOT NULL,
    "prontuarioId" INTEGER NOT NULL,
    "acaoId" INTEGER NOT NULL,
    "profissionalId" INTEGER NOT NULL,
    "dataAtendimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoAtendimento" "TipoAtendimento" NOT NULL,
    "motivoConsulta" TEXT NOT NULL,
    "hipoteseDiagnostica" TEXT,
    "conduta" TEXT,
    "retornoPrevisto" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao_fisica" (
    "id" SERIAL NOT NULL,
    "atendimentoId" INTEGER NOT NULL,
    "pesoKg" DECIMAL(5,2),
    "alturaCm" DECIMAL(5,1),
    "imc" DECIMAL(5,2),
    "pressaoArterial" VARCHAR(10),
    "freqCardiaca" INTEGER,
    "temperatura" DECIMAL(4,1),
    "saturacaoO2" DECIMAL(4,1),

    CONSTRAINT "avaliacao_fisica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescricao" (
    "id" SERIAL NOT NULL,
    "atendimentoId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "validade" DATE,
    "observacoes" TEXT,

    CONSTRAINT "prescricao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aluno_pessoaId_key" ON "aluno"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_matricula_key" ON "aluno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "professor_pessoaId_key" ON "professor"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "professor_matricula_key" ON "professor"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_cpf_key" ON "pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "participante_pessoaId_key" ON "participante"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "membro_equipe_pessoaId_key" ON "membro_equipe"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "equipe_acao_membroId_acaoId_key" ON "equipe_acao"("membroId", "acaoId");

-- CreateIndex
CREATE UNIQUE INDEX "prontuario_participanteId_key" ON "prontuario"("participanteId");

-- CreateIndex
CREATE UNIQUE INDEX "prontuario_numeroProntuario_key" ON "prontuario"("numeroProntuario");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_fisica_atendimentoId_key" ON "avaliacao_fisica"("atendimentoId");

-- AddForeignKey
ALTER TABLE "colegiado" ADD CONSTRAINT "colegiado_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curso" ADD CONSTRAINT "curso_colegiadoId_fkey" FOREIGN KEY ("colegiadoId") REFERENCES "colegiado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleo" ADD CONSTRAINT "nucleo_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linha_atuacao" ADD CONSTRAINT "linha_atuacao_nucleoId_fkey" FOREIGN KEY ("nucleoId") REFERENCES "nucleo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acao_extensionista" ADD CONSTRAINT "acao_extensionista_linhaAtuacaoId_fkey" FOREIGN KEY ("linhaAtuacaoId") REFERENCES "linha_atuacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acao_extensionista" ADD CONSTRAINT "acao_extensionista_tipoAcaoId_fkey" FOREIGN KEY ("tipoAcaoId") REFERENCES "tipo_acao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acao_extensionista" ADD CONSTRAINT "acao_extensionista_localId_fkey" FOREIGN KEY ("localId") REFERENCES "local_acao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento_acao" ADD CONSTRAINT "documento_acao_acaoId_fkey" FOREIGN KEY ("acaoId") REFERENCES "acao_extensionista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membro_equipe" ADD CONSTRAINT "membro_equipe_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membro_equipe" ADD CONSTRAINT "membro_equipe_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipe_acao" ADD CONSTRAINT "equipe_acao_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "membro_equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipe_acao" ADD CONSTRAINT "equipe_acao_acaoId_fkey" FOREIGN KEY ("acaoId") REFERENCES "acao_extensionista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao_acao" ADD CONSTRAINT "participacao_acao_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao_acao" ADD CONSTRAINT "participacao_acao_acaoId_fkey" FOREIGN KEY ("acaoId") REFERENCES "acao_extensionista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuario" ADD CONSTRAINT "prontuario_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimento" ADD CONSTRAINT "atendimento_prontuarioId_fkey" FOREIGN KEY ("prontuarioId") REFERENCES "prontuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimento" ADD CONSTRAINT "atendimento_acaoId_fkey" FOREIGN KEY ("acaoId") REFERENCES "acao_extensionista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimento" ADD CONSTRAINT "atendimento_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "membro_equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_fisica" ADD CONSTRAINT "avaliacao_fisica_atendimentoId_fkey" FOREIGN KEY ("atendimentoId") REFERENCES "atendimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescricao" ADD CONSTRAINT "prescricao_atendimentoId_fkey" FOREIGN KEY ("atendimentoId") REFERENCES "atendimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
