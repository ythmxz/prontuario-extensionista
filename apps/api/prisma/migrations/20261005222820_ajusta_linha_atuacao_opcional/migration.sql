-- DropForeignKey
ALTER TABLE "acao_extensionista" DROP CONSTRAINT "acao_extensionista_linhaAtuacaoId_fkey";

-- AlterTable
ALTER TABLE "acao_extensionista" ALTER COLUMN "linhaAtuacaoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "acao_extensionista" ADD CONSTRAINT "acao_extensionista_linhaAtuacaoId_fkey" FOREIGN KEY ("linhaAtuacaoId") REFERENCES "linha_atuacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
