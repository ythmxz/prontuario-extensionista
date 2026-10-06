import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.ts";

async function main() {
  console.log("Iniciando seed completo...");

  // =========================================================
  // USUÁRIOS
  // =========================================================

  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Administrador do Sistema",
        email: "admin@njbv.uesc.br",
        cpf: "11111111111",
        phone: "(73) 99999-0001",
        passwordHash,
      },
      {
        name: "Coordenadora de Extensão",
        email: "coordenacao@njbv.uesc.br",
        cpf: "22222222222",
        phone: "(73) 99999-0002",
        passwordHash,
      },
      {
        name: "Secretaria NJBV",
        email: "secretaria@njbv.uesc.br",
        cpf: "33333333333",
        phone: "(73) 99999-0003",
        passwordHash,
      },
    ],
  });

  // =========================================================
  // DEPARTAMENTOS
  // =========================================================

  const departamentoDEC = await prisma.departamento.create({
    data: {
      nome: "Departamento de Engenharias e Computação",
      sigla: "DEC",
    },
  });

  const departamentoDCSAU = await prisma.departamento.create({
    data: {
      nome: "Departamento de Ciências da Saúde",
      sigla: "DCSAU",
    },
  });

  const departamentoDFCH = await prisma.departamento.create({
    data: {
      nome: "Departamento de Filosofia e Ciências Humanas",
      sigla: "DFCH",
    },
  });

  // =========================================================
  // COLEGIADOS
  // =========================================================

  const colegiadoComputacao = await prisma.colegiado.create({
    data: {
      departamentoId: departamentoDEC.id,
      nome: "Colegiado de Ciência da Computação",
    },
  });

  const colegiadoEnfermagem = await prisma.colegiado.create({
    data: {
      departamentoId: departamentoDCSAU.id,
      nome: "Colegiado de Enfermagem",
    },
  });

  const colegiadoSaudeColetiva = await prisma.colegiado.create({
    data: {
      departamentoId: departamentoDCSAU.id,
      nome: "Colegiado de Saúde Coletiva",
    },
  });

  const colegiadoHistoria = await prisma.colegiado.create({
    data: {
      departamentoId: departamentoDFCH.id,
      nome: "Colegiado de História",
    },
  });

  // =========================================================
  // CURSOS
  // =========================================================

  const cursoComputacao = await prisma.curso.create({
    data: {
      colegiadoId: colegiadoComputacao.id,
      nome: "Ciência da Computação",
      sigla: "CC",
      nivel: "GRADUACAO",
      cargaHoraria: 3200,
      duracaoPeriodos: 8,
    },
  });

  const cursoEnfermagem = await prisma.curso.create({
    data: {
      colegiadoId: colegiadoEnfermagem.id,
      nome: "Enfermagem",
      sigla: "ENF",
      nivel: "GRADUACAO",
      cargaHoraria: 4200,
      duracaoPeriodos: 10,
    },
  });

  const cursoSaudeColetiva = await prisma.curso.create({
    data: {
      colegiadoId: colegiadoSaudeColetiva.id,
      nome: "Saúde Coletiva",
      sigla: "SC",
      nivel: "GRADUACAO",
      cargaHoraria: 3200,
      duracaoPeriodos: 8,
    },
  });

  const cursoHistoria = await prisma.curso.create({
    data: {
      colegiadoId: colegiadoHistoria.id,
      nome: "História",
      sigla: "HIS",
      nivel: "GRADUACAO",
      cargaHoraria: 3200,
      duracaoPeriodos: 8,
    },
  });

  // =========================================================
  // PESSOAS
  // =========================================================

  const pessoa1 = await prisma.pessoa.create({
    data: {
      cpf: "30000000001",
      nome: "Mariana Oliveira",
      dataNascimento: new Date("1982-04-15"),
      sexo: "F",
      telefone: "(73) 98888-1001",
      email: "mariana.oliveira@uesc.br",
      endereco: "Av. Beira Rio, 100",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa2 = await prisma.pessoa.create({
    data: {
      cpf: "30000000002",
      nome: "Carlos Eduardo Souza",
      dataNascimento: new Date("1978-09-20"),
      sexo: "M",
      telefone: "(73) 98888-1002",
      email: "carlos.souza@uesc.br",
      endereco: "Rua das Acácias, 50",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa3 = await prisma.pessoa.create({
    data: {
      cpf: "30000000003",
      nome: "João Pedro Santos",
      dataNascimento: new Date("2004-02-12"),
      sexo: "M",
      telefone: "(73) 98888-1003",
      email: "joao.santos@uesc.br",
      endereco: "Rua A, 12",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa4 = await prisma.pessoa.create({
    data: {
      cpf: "30000000004",
      nome: "Ana Beatriz Costa",
      dataNascimento: new Date("2003-07-25"),
      sexo: "F",
      telefone: "(73) 98888-1004",
      email: "ana.costa@uesc.br",
      endereco: "Rua B, 30",
      municipio: "Ilhéus",
      uf: "BA",
    },
  });

  const pessoa5 = await prisma.pessoa.create({
    data: {
      cpf: "30000000005",
      nome: "Maria Oliveira",
      dataNascimento: new Date("1996-03-10"),
      sexo: "F",
      telefone: "(73) 98888-1005",
      email: "maria.oliveira@gmail.com",
      endereco: "Rua das Flores, 123",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa6 = await prisma.pessoa.create({
    data: {
      cpf: "30000000006",
      nome: "José Carlos Almeida",
      dataNascimento: new Date("1989-11-03"),
      sexo: "M",
      telefone: "(73) 98888-1006",
      email: "jose.almeida@gmail.com",
      endereco: "Rua Primavera, 80",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa7 = await prisma.pessoa.create({
    data: {
      cpf: "30000000007",
      nome: "Lucas Ferreira",
      dataNascimento: new Date("2002-01-18"),
      sexo: "M",
      telefone: "(73) 98888-1007",
      email: "lucas.ferreira@uesc.br",
      endereco: "Rua Universitária, 45",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa8 = await prisma.pessoa.create({
    data: {
      cpf: "30000000008",
      nome: "Carla Mendes",
      dataNascimento: new Date("1985-06-28"),
      sexo: "F",
      telefone: "(73) 98888-1008",
      email: "carla.mendes@uesc.br",
      endereco: "Av. Central, 400",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa9 = await prisma.pessoa.create({
    data: {
      cpf: "30000000009",
      nome: "Rafael Almeida",
      dataNascimento: new Date("1993-10-05"),
      sexo: "M",
      telefone: "(73) 98888-1009",
      email: "rafael.almeida@gmail.com",
      endereco: "Rua do Sol, 90",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa10 = await prisma.pessoa.create({
    data: {
      cpf: "30000000010",
      nome: "Ana Clara Lima",
      dataNascimento: new Date("1998-12-22"),
      sexo: "F",
      telefone: "(73) 98888-1010",
      email: "ana.lima@gmail.com",
      endereco: "Rua Nova, 22",
      municipio: "Ilhéus",
      uf: "BA",
    },
  });

  const pessoa11 = await prisma.pessoa.create({
    data: {
      cpf: "30000000011",
      nome: "Paulo Henrique Souza",
      dataNascimento: new Date("1987-05-08"),
      sexo: "M",
      telefone: "(73) 98888-1011",
      email: "paulo.souza@uesc.br",
      endereco: "Rua das Palmeiras, 70",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa12 = await prisma.pessoa.create({
    data: {
      cpf: "30000000012",
      nome: "Fernanda Alves",
      dataNascimento: new Date("1990-08-17"),
      sexo: "F",
      telefone: "(73) 98888-1012",
      email: "fernanda.alves@uesc.br",
      endereco: "Rua dos Ipês, 45",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa13 = await prisma.pessoa.create({
    data: {
      cpf: "30000000013",
      nome: "Gabriel Santos",
      dataNascimento: new Date("1999-02-28"),
      sexo: "M",
      telefone: "(73) 98888-1013",
      email: "gabriel.santos@gmail.com",
      endereco: "Rua Nova Esperança, 90",
      municipio: "Ilhéus",
      uf: "BA",
    },
  });

  const pessoa14 = await prisma.pessoa.create({
    data: {
      cpf: "30000000014",
      nome: "Beatriz Martins",
      dataNascimento: new Date("1988-12-03"),
      sexo: "F",
      telefone: "(73) 98888-1014",
      email: "beatriz.martins@gmail.com",
      endereco: "Rua da Paz, 120",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  const pessoa15 = await prisma.pessoa.create({
    data: {
      cpf: "30000000015",
      nome: "Ricardo Nascimento",
      dataNascimento: new Date("1995-04-19"),
      sexo: "M",
      telefone: "(73) 98888-1015",
      email: "ricardo.nascimento@gmail.com",
      endereco: "Rua do Comércio, 32",
      municipio: "Itabuna",
      uf: "BA",
    },
  });

  // =========================================================
  // PROFESSORES
  // =========================================================

  await prisma.professor.create({
    data: {
      pessoaId: pessoa1.id,
      departamentoId: departamentoDEC.id,
      matricula: "PROF001",
      vinculo: "Professor efetivo",
    },
  });

  await prisma.professor.create({
    data: {
      pessoaId: pessoa2.id,
      departamentoId: departamentoDCSAU.id,
      matricula: "PROF002",
      vinculo: "Professor efetivo",
    },
  });

  await prisma.professor.create({
    data: {
      pessoaId: pessoa11.id,
      departamentoId: departamentoDFCH.id,
      matricula: "PROF003",
      vinculo: "Professor efetivo",
    },
  });

  // =========================================================
  // ALUNOS
  // =========================================================

  await prisma.aluno.create({
    data: {
      pessoaId: pessoa3.id,
      cursoId: cursoComputacao.id,
      matricula: "20260001",
      periodoAtual: 5,
      situacao: "ATIVO",
      dataIngresso: new Date("2024-02-15"),
    },
  });

  await prisma.aluno.create({
    data: {
      pessoaId: pessoa4.id,
      cursoId: cursoEnfermagem.id,
      matricula: "20260002",
      periodoAtual: 6,
      situacao: "ATIVO",
      dataIngresso: new Date("2023-02-15"),
    },
  });

  await prisma.aluno.create({
    data: {
      pessoaId: pessoa13.id,
      cursoId: cursoSaudeColetiva.id,
      matricula: "20250003",
      periodoAtual: 4,
      situacao: "ATIVO",
      dataIngresso: new Date("2025-02-15"),
    },
  });

  await prisma.aluno.create({
    data: {
      pessoaId: pessoa15.id,
      cursoId: cursoHistoria.id,
      matricula: "20240004",
      periodoAtual: 7,
      situacao: "ATIVO",
      dataIngresso: new Date("2024-02-15"),
    },
  });

  // =========================================================
  // NÚCLEOS
  // =========================================================

  const nucleo = await prisma.nucleo.create({
    data: {
      departamentoId: departamentoDEC.id,
      nome: "Núcleo Jovem Bom de Vida",
      sigla: "NJBV",
      objetivo:
        "Promover ações de extensão voltadas à integração da universidade com a comunidade.",
      dataAprovacao: new Date("2026-01-15"),
      resolucaoConsepe: "Resolução 01/2026",
    },
  });

  const nucleoSaude = await prisma.nucleo.create({
    data: {
      departamentoId: departamentoDCSAU.id,
      nome: "Núcleo de Saúde Comunitária",
      sigla: "NSC",
      objetivo:
        "Desenvolver ações extensionistas de promoção e educação em saúde.",
      dataAprovacao: new Date("2026-02-01"),
      resolucaoConsepe: "Resolução 02/2026",
    },
  });

  // =========================================================
  // LINHAS DE ATUAÇÃO
  // =========================================================

  const linhaEducacao = await prisma.linhaAtuacao.create({
    data: {
      nucleoId: nucleo.id,
      nome: "Educação e Extensão Comunitária",
      descricao:
        "Ações educativas e atividades de integração com a comunidade.",
      publicoFoco: "Comunidade Geral",
    },
  });

  const linhaTecnologia = await prisma.linhaAtuacao.create({
    data: {
      nucleoId: nucleo.id,
      nome: "Inclusão e Educação Digital",
      descricao:
        "Ações de inclusão digital e formação tecnológica.",
      publicoFoco: "Comunidade Geral",
    },
  });

  const linhaSaude = await prisma.linhaAtuacao.create({
    data: {
      nucleoId: nucleoSaude.id,
      nome: "Promoção da Saúde",
      descricao:
        "Ações de promoção da saúde, prevenção e educação comunitária.",
      publicoFoco: "Usuários da Comunidade",
    },
  });

  // =========================================================
  // TIPOS DE AÇÃO
  // =========================================================

  const tipoProjeto = await prisma.tipoAcao.create({
    data: {
      nome: "Projeto",
      descricao: "Projeto de extensão continuada.",
    },
  });

  const tipoCurso = await prisma.tipoAcao.create({
    data: {
      nome: "Curso",
      descricao: "Curso de capacitação comunitária.",
    },
  });

  const tipoOficina = await prisma.tipoAcao.create({
    data: {
      nome: "Oficina",
      descricao:
        "Atividade prática e educativa de curta duração.",
    },
  });

  // =========================================================
  // LOCAIS
  // =========================================================

  const localCampus = await prisma.localAcao.create({
    data: {
      nome: "Campus Principal da UESC",
      tipo: "CAMPUS",
      endereco: "Rodovia Jorge Amado, km 16",
      municipio: "Ilhéus",
    },
  });

  const localEscola = await prisma.localAcao.create({
    data: {
      nome: "Escola Municipal Comunitária",
      tipo: "ESCOLA",
      endereco: "Rua das Flores, 123",
      municipio: "Itabuna",
    },
  });

  const localComunidade = await prisma.localAcao.create({
    data: {
      nome: "Centro Comunitário do Bairro",
      tipo: "COMUNIDADE",
      endereco: "Rua Principal, 200",
      municipio: "Itabuna",
    },
  });

  const localUBS = await prisma.localAcao.create({
    data: {
      nome: "UBS Comunitária Central",
      tipo: "UBS",
      endereco: "Av. Central, 500",
      municipio: "Itabuna",
    },
  });

  // =========================================================
  // AÇÕES EXTENSIONISTAS
  // =========================================================

  const acao1 = await prisma.acaoExtensionista.create({
    data: {
      titulo: "Programa de Reforço Escolar Comunitário",
      descricao:
        "Projeto voltado para o apoio escolar de crianças da rede pública.",
      dataInicio: new Date("2026-03-01"),
      dataFim: null,
      cargaHoraria: 40.5,
      modalidade: "PRESENCIAL",
      publicoAlvo: "Crianças e Adolescentes",
      status: "EM_ANDAMENTO",
      tipoAcaoId: tipoProjeto.id,
      localId: localEscola.id,
      linhaAtuacaoId: linhaEducacao.id,
    },
  });

  const acao2 = await prisma.acaoExtensionista.create({
    data: {
      titulo: "Curso de Introdução à Informática Básica",
      descricao:
        "Capacitação tecnológica voltada para pessoas da terceira idade.",
      dataInicio: new Date("2026-04-01"),
      dataFim: null,
      cargaHoraria: 20,
      modalidade: "HIBRIDO",
      publicoAlvo: "Idosos da Comunidade",
      status: "PLANEJADA",
      tipoAcaoId: tipoCurso.id,
      localId: localCampus.id,
      linhaAtuacaoId: linhaTecnologia.id,
    },
  });

  const acao3 = await prisma.acaoExtensionista.create({
    data: {
      titulo: "Oficina de Educação Ambiental e Reciclagem",
      descricao:
        "Palestras e oficinas práticas sobre sustentabilidade urbana.",
      dataInicio: new Date("2026-02-01"),
      dataFim: new Date("2026-06-30"),
      cargaHoraria: 15,
      modalidade: "PRESENCIAL",
      publicoAlvo: "Moradores do Bairro",
      status: "CONCLUIDA",
      tipoAcaoId: tipoOficina.id,
      localId: localComunidade.id,
      linhaAtuacaoId: linhaEducacao.id,
    },
  });

  const acao4 = await prisma.acaoExtensionista.create({
    data: {
      titulo: "Projeto Saúde Digital na Comunidade",
      descricao:
        "Ações educativas sobre saúde digital e orientação comunitária.",
      dataInicio: new Date("2026-05-10"),
      dataFim: null,
      cargaHoraria: 30,
      modalidade: "HIBRIDO",
      publicoAlvo: "Usuários da Comunidade",
      status: "EM_ANDAMENTO",
      tipoAcaoId: tipoProjeto.id,
      localId: localUBS.id,
      linhaAtuacaoId: linhaSaude.id,
    },
  });

  const acao5 = await prisma.acaoExtensionista.create({
    data: {
      titulo: "Curso de Educação Financeira Comunitária",
      descricao:
        "Curso introdutório sobre organização financeira pessoal e familiar.",
      dataInicio: new Date("2026-08-01"),
      dataFim: null,
      cargaHoraria: 18,
      modalidade: "REMOTO",
      publicoAlvo: "Adultos da Comunidade",
      status: "PLANEJADA",
      tipoAcaoId: tipoCurso.id,
      localId: localCampus.id,
      linhaAtuacaoId: linhaEducacao.id,
    },
  });

  // =========================================================
  // PARTICIPANTES
  // =========================================================

  const participante1 = await prisma.participante.create({
    data: {
      pessoaId: pessoa5.id,
      escolaridade: "Ensino Médio Completo",
      nomeResponsavel: "Helena Oliveira",
      telResponsavel: "(73) 97777-1001",
      observacoes:
        "Participante frequente das atividades comunitárias.",
    },
  });

  const participante2 = await prisma.participante.create({
    data: {
      pessoaId: pessoa6.id,
      escolaridade: "Ensino Fundamental Completo",
      nomeResponsavel: "José Almeida",
      telResponsavel: "(73) 97777-1002",
      observacoes:
        "Participante do projeto de inclusão digital.",
    },
  });

  const participante3 = await prisma.participante.create({
    data: {
      pessoaId: pessoa9.id,
      escolaridade: "Ensino Superior Incompleto",
      nomeResponsavel: null,
      telResponsavel: null,
      observacoes:
        "Participante voluntário das atividades.",
    },
  });

  const participante4 = await prisma.participante.create({
    data: {
      pessoaId: pessoa12.id,
      escolaridade: "Ensino Médio Completo",
      nomeResponsavel: "Fernanda Alves",
      telResponsavel: "(73) 97777-1004",
      observacoes:
        "Participante ativa em ações de saúde.",
    },
  });

  // =========================================================
  // MEMBROS DA EQUIPE
  //
  // Os membros 1, 2 e 3 possuem vínculos.
  // O membro 4 fica sem vínculo para teste.
  // =========================================================

  const membro1 = await prisma.membroEquipe.create({
    data: {
      pessoaId: pessoa7.id,
      departamentoId: departamentoDEC.id,
      tipo: "DISCENTE",
      matricula: "202610001",
      vinculo: "Bolsista de extensão",
    },
  });

  const membro2 = await prisma.membroEquipe.create({
    data: {
      pessoaId: pessoa8.id,
      departamentoId: departamentoDCSAU.id,
      tipo: "DOCENTE",
      matricula: "PROF004",
      vinculo: "Professor colaborador",
    },
  });

  const membro3 = await prisma.membroEquipe.create({
    data: {
      pessoaId: pessoa10.id,
      departamentoId: departamentoDFCH.id,
      tipo: "VOLUNTARIO",
      matricula: null,
      vinculo: "Voluntária",
    },
  });

  const membro4 = await prisma.membroEquipe.create({
    data: {
      pessoaId: pessoa14.id,
      departamentoId: departamentoDEC.id,
      tipo: "TECNICO",
      matricula: "TEC001",
      vinculo: "Técnica administrativa",
    },
  });

  // =========================================================
  // VÍNCULOS DOS MEMBROS ÀS AÇÕES
  // =========================================================

  await prisma.equipeAcao.create({
    data: {
      membroId: membro1.id,
      acaoId: acao1.id,
      papel: "Bolsista",
      dataEntrada: new Date("2026-03-01"),
      horasDedicadas: 20,
    },
  });

  await prisma.equipeAcao.create({
    data: {
      membroId: membro1.id,
      acaoId: acao4.id,
      papel: "Apoio Técnico",
      dataEntrada: new Date("2026-05-10"),
      horasDedicadas: 18,
    },
  });

  await prisma.equipeAcao.create({
    data: {
      membroId: membro2.id,
      acaoId: acao1.id,
      papel: "Coordenadora",
      dataEntrada: new Date("2026-03-01"),
      horasDedicadas: 40,
    },
  });

  await prisma.equipeAcao.create({
    data: {
      membroId: membro3.id,
      acaoId: acao2.id,
      papel: "Voluntária",
      dataEntrada: new Date("2026-04-01"),
      horasDedicadas: 15,
    },
  });

  await prisma.equipeAcao.create({
    data: {
      membroId: membro3.id,
      acaoId: acao3.id,
      papel: "Facilitadora",
      dataEntrada: new Date("2026-02-01"),
      dataSaida: new Date("2026-06-30"),
      horasDedicadas: 12,
    },
  });

  // =========================================================
  // PARTICIPAÇÕES
  // =========================================================

  await prisma.participacaoAcao.create({
    data: {
      participanteId: participante1.id,
      acaoId: acao1.id,
      dataParticipacao: new Date("2026-05-10"),
      frequencia: "PRESENTE",
      observacoes:
        "Participou da atividade de reforço escolar.",
    },
  });

  await prisma.participacaoAcao.create({
    data: {
      participanteId: participante1.id,
      acaoId: acao3.id,
      dataParticipacao: new Date("2026-04-10"),
      frequencia: "PRESENTE",
      observacoes:
        "Participou da oficina ambiental.",
    },
  });

  await prisma.participacaoAcao.create({
    data: {
      participanteId: participante2.id,
      acaoId: acao1.id,
      dataParticipacao: new Date("2026-05-10"),
      frequencia: "PRESENTE",
      observacoes: "Participação regular.",
    },
  });

  await prisma.participacaoAcao.create({
    data: {
      participanteId: participante2.id,
      acaoId: acao2.id,
      dataParticipacao: new Date("2026-05-20"),
      frequencia: "JUSTIFICADO",
      observacoes:
        "Ausência justificada previamente.",
    },
  });

  await prisma.participacaoAcao.create({
    data: {
      participanteId: participante3.id,
      acaoId: acao3.id,
      dataParticipacao: new Date("2026-05-22"),
      frequencia: "PRESENTE",
      observacoes:
        "Participou da atividade comunitária.",
    },
  });

  await prisma.participacaoAcao.create({
    data: {
      participanteId: participante4.id,
      acaoId: acao4.id,
      dataParticipacao: new Date("2026-06-05"),
      frequencia: "PRESENTE",
      observacoes:
        "Participou da atividade de saúde digital.",
    },
  });

  // =========================================================
  // DOCUMENTOS
  // =========================================================

  await prisma.documentoAcao.create({
    data: {
      acaoId: acao1.id,
      tipo: "RELATORIO",
      titulo: "Relatório de Reforço Escolar",
      arquivoUrl:
        "https://example.com/documentos/reforco-escolar.pdf",
    },
  });

  await prisma.documentoAcao.create({
    data: {
      acaoId: acao1.id,
      tipo: "MATERIAL_EDUCATIVO",
      titulo: "Material de Apoio Escolar",
      arquivoUrl:
        "https://example.com/documentos/material-escolar.pdf",
    },
  });

  await prisma.documentoAcao.create({
    data: {
      acaoId: acao2.id,
      tipo: "RELATORIO",
      titulo: "Plano do Curso de Informática",
      arquivoUrl:
        "https://example.com/documentos/informatica.pdf",
    },
  });

  await prisma.documentoAcao.create({
    data: {
      acaoId: acao3.id,
      tipo: "FOTO",
      titulo: "Registro Fotográfico da Oficina Ambiental",
      arquivoUrl:
        "https://example.com/documentos/oficina-ambiental.jpg",
    },
  });

  await prisma.documentoAcao.create({
    data: {
      acaoId: acao4.id,
      tipo: "RELATORIO",
      titulo: "Relatório Saúde Digital",
      arquivoUrl:
        "https://example.com/documentos/saude-digital.pdf",
    },
  });

  // =========================================================
  // PRONTUÁRIOS
  // =========================================================

  const prontuario1 = await prisma.prontuario.create({
    data: {
      participanteId: participante1.id,
      numeroProntuario: "PRT-2026-0001",
      dataAbertura: new Date("2026-05-10"),
      tipoSanguineo: "O+",
      alergias: "Sem alergias informadas.",
      obsGerais:
        "Paciente em acompanhamento extensionista.",
    },
  });

  const prontuario2 = await prisma.prontuario.create({
    data: {
      participanteId: participante2.id,
      numeroProntuario: "PRT-2026-0002",
      dataAbertura: new Date("2026-05-20"),
      tipoSanguineo: "A+",
      alergias:
        "Alergia a dipirona relatada.",
      obsGerais:
        "Acompanhamento periódico.",
    },
  });

  const prontuario3 = await prisma.prontuario.create({
    data: {
      participanteId: participante3.id,
      numeroProntuario: "PRT-2026-0003",
      dataAbertura: new Date("2026-06-05"),
      tipoSanguineo: "B+",
      alergias: null,
      obsGerais:
        "Primeiro atendimento registrado.",
    },
  });

  // =========================================================
  // ATENDIMENTOS
  // =========================================================

  const atendimento1 = await prisma.atendimento.create({
    data: {
      prontuarioId: prontuario1.id,
      acaoId: acao1.id,
      profissionalId: membro2.id,
      dataAtendimento:
        new Date("2026-05-10T08:00:00"),
      tipoAtendimento: "ACOMPANHAMENTO",
      motivoConsulta:
        "Acompanhamento da participação na ação extensionista.",
      hipoteseDiagnostica:
        "Sem alterações relevantes.",
      conduta: "Orientações gerais.",
      retornoPrevisto: new Date("2026-06-10"),
    },
  });

  const atendimento2 = await prisma.atendimento.create({
    data: {
      prontuarioId: prontuario2.id,
      acaoId: acao2.id,
      profissionalId: membro2.id,
      dataAtendimento:
        new Date("2026-05-20T10:00:00"),
      tipoAtendimento: "ORIENTACAO",
      motivoConsulta:
        "Orientação durante atividade extensionista.",
      hipoteseDiagnostica: null,
      conduta: "Orientações educativas.",
      retornoPrevisto: new Date("2026-06-20"),
    },
  });

  const atendimento3 = await prisma.atendimento.create({
    data: {
      prontuarioId: prontuario3.id,
      acaoId: acao4.id,
      profissionalId: membro1.id,
      dataAtendimento:
        new Date("2026-06-05T14:00:00"),
      tipoAtendimento: "TRIAGEM",
      motivoConsulta:
        "Triagem inicial durante ação comunitária.",
      hipoteseDiagnostica:
        "Sem sinais de alerta.",
      conduta:
        "Encaminhamento para acompanhamento.",
      retornoPrevisto: new Date("2026-07-05"),
    },
  });

  // =========================================================
  // AVALIAÇÕES FÍSICAS
  // =========================================================

  await prisma.avaliacaoFisica.create({
    data: {
      atendimentoId: atendimento1.id,
      pesoKg: 68.5,
      alturaCm: 165,
      imc: 25.14,
      pressaoArterial: "120/80",
      freqCardiaca: 72,
      temperatura: 36.5,
      saturacaoO2: 98,
    },
  });

  await prisma.avaliacaoFisica.create({
    data: {
      atendimentoId: atendimento3.id,
      pesoKg: 74.2,
      alturaCm: 171,
      imc: 25.4,
      pressaoArterial: "118/76",
      freqCardiaca: 75,
      temperatura: 36.6,
      saturacaoO2: 99,
    },
  });

  // =========================================================
  // PRESCRIÇÕES
  // =========================================================

  await prisma.prescricao.create({
    data: {
      atendimentoId: atendimento1.id,
      descricao:
        "Manter rotina de atividades físicas e hidratação adequada.",
      validade: new Date("2026-07-10"),
      observacoes:
        "Reavaliar no próximo atendimento.",
    },
  });

  await prisma.prescricao.create({
    data: {
      atendimentoId: atendimento3.id,
      descricao:
        "Acompanhar orientações fornecidas durante a triagem.",
      validade: new Date("2026-08-05"),
      observacoes:
        "Retorno conforme necessidade.",
    },
  });

  // =========================================================
  // RESUMO
  // =========================================================

  console.log("");
  console.log("========================================");
  console.log("SEED EXECUTADO COM SUCESSO");
  console.log("========================================");
  console.log("");
  console.log("Usuários:");
  console.log("admin@njbv.uesc.br / 123456");
  console.log("coordenacao@njbv.uesc.br / 123456");
  console.log("secretaria@njbv.uesc.br / 123456");
  console.log("");
  console.log("Dados criados:");
  console.log("- 3 usuários");
  console.log("- 3 departamentos");
  console.log("- 4 colegiados");
  console.log("- 4 cursos");
  console.log("- 15 pessoas");
  console.log("- 3 professores");
  console.log("- 4 alunos");
  console.log("- 2 núcleos");
  console.log("- 3 linhas de atuação");
  console.log("- 3 tipos de ação");
  console.log("- 4 locais");
  console.log("- 5 ações extensionistas");
  console.log("- 4 participantes");
  console.log("- 4 membros de equipe");
  console.log("- 5 vínculos equipe/ação");
  console.log("- 6 participações");
  console.log("- 5 documentos");
  console.log("- 3 prontuários");
  console.log("- 3 atendimentos");
  console.log("- 2 avaliações físicas");
  console.log("- 2 prescrições");
  console.log("");
}

main()
  .catch((error) => {
    console.error("Erro no seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
