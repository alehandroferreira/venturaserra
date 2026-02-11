import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  console.log('🗑️  Limpando dados existentes...');
  await prisma.historicoMovimentacao.deleteMany();
  await prisma.viagem.deleteMany();
  await prisma.operador.deleteMany();
  await prisma.cliente.deleteMany();

  // Criar Admin
  console.log('👤 Criando admin...');
  const admin = await prisma.operador.create({
    data: {
      nome: 'Administrador',
      email: 'admin@local.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  // Criar Operadores
  console.log('👥 Criando operadores...');
  const operadores = await Promise.all([
    prisma.operador.create({
      data: {
        nome: 'João Silva',
        email: 'joao@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Maria Santos',
        email: 'maria@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Pedro Oliveira',
        email: 'pedro@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Ana Costa',
        email: 'ana@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Lucas Pereira',
        email: 'lucas@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Fernanda Lima',
        email: 'fernanda@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Rafael Souza',
        email: 'rafael@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Juliana Alves',
        email: 'juliana@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Bruno Rocha',
        email: 'bruno@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Carla Mendes',
        email: 'carla@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Diego Martins',
        email: 'diego@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Patricia Nunes',
        email: 'patricia@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Ricardo Barros',
        email: 'ricardo@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Sonia Ribeiro',
        email: 'sonia@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Tiago Araujo',
        email: 'tiago@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Vanessa Freitas',
        email: 'vanessa@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Wagner Pires',
        email: 'wagner@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Yara Carvalho',
        email: 'yara@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Gustavo Teixeira',
        email: 'gustavo@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
    prisma.operador.create({
      data: {
        nome: 'Helena Duarte',
        email: 'helena@local.com',
        passwordHash: await bcrypt.hash('123456', 10),
        role: 'OPERATOR',
      },
    }),
  ]);

  // Criar Clientes
  console.log('🏢 Criando clientes...');
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nome: 'Empresa ABC Ltda',
        email: 'contato@empresaabc.com',
        telefone: '(11) 98765-4321',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Comércio XYZ S.A.',
        email: 'vendas@comercioxyz.com',
        telefone: '(21) 97654-3210',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Indústria 123',
        email: 'logistica@industria123.com',
        telefone: '(19) 96543-2109',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Distribuidora Brasil',
        email: 'brasil@distribuidora.com',
        telefone: '(41) 95432-1098',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Importadora Global',
        email: 'global@importadora.com',
        telefone: '(85) 94321-0987',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Exportadora Sul',
        email: 'sul@exportadora.com',
        telefone: '(51) 93210-9876',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Logística Rápida',
        email: 'rapida@logistica.com',
        telefone: '(31) 92109-8765',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Transportes Nordeste',
        email: 'nordeste@transportes.com',
        telefone: '(81) 91098-7654',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Cargas Pesadas Ltda',
        email: 'pesadas@cargas.com',
        telefone: '(62) 90987-6543',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Express Delivery',
        email: 'express@delivery.com',
        telefone: '(47) 89876-5432',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Rota Nacional',
        email: 'contato@rotanacional.com',
        telefone: '(11) 91234-5678',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'TecnoParts',
        email: 'vendas@tecnoparts.com',
        telefone: '(31) 93456-7890',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Alimentos Serra',
        email: 'compras@alimentosserra.com',
        telefone: '(21) 94567-8901',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Matriz Log',
        email: 'log@matriz.com',
        telefone: '(41) 95678-9012',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Horizonte Tech',
        email: 'contact@horizontetech.com',
        telefone: '(85) 96789-0123',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Polo Industrial Norte',
        email: 'norte@poloindustrial.com',
        telefone: '(51) 97890-1234',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Distribuidora Leste',
        email: 'leste@distribuidora.com',
        telefone: '(19) 98901-2345',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Mercantil do Vale',
        email: 'contato@mercantildovale.com',
        telefone: '(62) 99012-3456',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'AgroSul',
        email: 'suporte@agrosul.com',
        telefone: '(47) 90123-4567',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Varejo Mix',
        email: 'compras@varejomix.com',
        telefone: '(31) 91234-9876',
      },
    }),
  ]);

  // Criar Viagens
  console.log('🚚 Criando viagens...');
  const now = new Date();
  const locais = [
    {
      texto: 'São Paulo, SP, Brasil',
      cidade: 'São Paulo',
      pais: 'Brasil',
      lat: -23.5505,
      lng: -46.6333,
    },
    {
      texto: 'Rio de Janeiro, RJ, Brasil',
      cidade: 'Rio de Janeiro',
      pais: 'Brasil',
      lat: -22.9068,
      lng: -43.1729,
    },
    {
      texto: 'Belo Horizonte, MG, Brasil',
      cidade: 'Belo Horizonte',
      pais: 'Brasil',
      lat: -19.9167,
      lng: -43.9345,
    },
    {
      texto: 'Curitiba, PR, Brasil',
      cidade: 'Curitiba',
      pais: 'Brasil',
      lat: -25.4284,
      lng: -49.2733,
    },
    {
      texto: 'Porto Alegre, RS, Brasil',
      cidade: 'Porto Alegre',
      pais: 'Brasil',
      lat: -30.0346,
      lng: -51.2177,
    },
    {
      texto: 'Salvador, BA, Brasil',
      cidade: 'Salvador',
      pais: 'Brasil',
      lat: -12.9714,
      lng: -38.5014,
    },
    { texto: 'Recife, PE, Brasil', cidade: 'Recife', pais: 'Brasil', lat: -8.0476, lng: -34.877 },
    {
      texto: 'Fortaleza, CE, Brasil',
      cidade: 'Fortaleza',
      pais: 'Brasil',
      lat: -3.7172,
      lng: -38.5433,
    },
    {
      texto: 'Brasília, DF, Brasil',
      cidade: 'Brasília',
      pais: 'Brasil',
      lat: -15.8267,
      lng: -47.9218,
    },
    {
      texto: 'Goiânia, GO, Brasil',
      cidade: 'Goiânia',
      pais: 'Brasil',
      lat: -16.6869,
      lng: -49.2648,
    },
    { texto: 'Manaus, AM, Brasil', cidade: 'Manaus', pais: 'Brasil', lat: -3.119, lng: -60.0217 },
    { texto: 'Belém, PA, Brasil', cidade: 'Belém', pais: 'Brasil', lat: -1.4558, lng: -48.5039 },
    {
      texto: 'Vitória, ES, Brasil',
      cidade: 'Vitória',
      pais: 'Brasil',
      lat: -20.3194,
      lng: -40.3378,
    },
    { texto: 'Maceió, AL, Brasil', cidade: 'Maceió', pais: 'Brasil', lat: -9.6498, lng: -35.7089 },
    { texto: 'Natal, RN, Brasil', cidade: 'Natal', pais: 'Brasil', lat: -5.7945, lng: -35.211 },
    {
      texto: 'João Pessoa, PB, Brasil',
      cidade: 'João Pessoa',
      pais: 'Brasil',
      lat: -7.1195,
      lng: -34.845,
    },
    {
      texto: 'Teresina, PI, Brasil',
      cidade: 'Teresina',
      pais: 'Brasil',
      lat: -5.0919,
      lng: -42.8034,
    },
    {
      texto: 'Campinas, SP, Brasil',
      cidade: 'Campinas',
      pais: 'Brasil',
      lat: -22.9099,
      lng: -47.0626,
    },
    { texto: 'Santos, SP, Brasil', cidade: 'Santos', pais: 'Brasil', lat: -23.9608, lng: -46.3336 },
    {
      texto: 'Florianópolis, SC, Brasil',
      cidade: 'Florianópolis',
      pais: 'Brasil',
      lat: -27.5954,
      lng: -48.548,
    },
    {
      texto: 'Joinville, SC, Brasil',
      cidade: 'Joinville',
      pais: 'Brasil',
      lat: -26.3045,
      lng: -48.8487,
    },
    { texto: 'Cuiabá, MT, Brasil', cidade: 'Cuiabá', pais: 'Brasil', lat: -15.601, lng: -56.0974 },
    {
      texto: 'Campo Grande, MS, Brasil',
      cidade: 'Campo Grande',
      pais: 'Brasil',
      lat: -20.4697,
      lng: -54.6201,
    },
  ];
  const statusPool = ['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'] as const;
  const viagensData = [
    {
      codigoCarga: 'CRG-2024-001',
      origemTexto: 'São Paulo, SP, Brasil',
      origemCidade: 'São Paulo',
      origemPais: 'Brasil',
      origemLat: -23.5505,
      origemLng: -46.6333,
      destinoTexto: 'Rio de Janeiro, RJ, Brasil',
      destinoCidade: 'Rio de Janeiro',
      destinoPais: 'Brasil',
      destinoLat: -22.9068,
      destinoLng: -43.1729,
      dataSaida: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      previsaoEntrega: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      statusAtual: 'ENTREGUE' as const,
      localAtualTexto: 'Rio de Janeiro, RJ, Brasil',
      localAtualLat: -22.9068,
      localAtualLng: -43.1729,
      clienteId: clientes[0].id,
      operadorId: operadores[0].id,
    },
    {
      codigoCarga: 'CRG-2024-002',
      origemTexto: 'Belo Horizonte, MG, Brasil',
      origemCidade: 'Belo Horizonte',
      origemPais: 'Brasil',
      origemLat: -19.9167,
      origemLng: -43.9345,
      destinoTexto: 'Salvador, BA, Brasil',
      destinoCidade: 'Salvador',
      destinoPais: 'Brasil',
      destinoLat: -12.9714,
      destinoLng: -38.5014,
      dataSaida: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      previsaoEntrega: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      statusAtual: 'EM_TRANSITO' as const,
      localAtualTexto: 'Vitória da Conquista, BA, Brasil',
      localAtualLat: -14.8615,
      localAtualLng: -40.8442,
      clienteId: clientes[1].id,
      operadorId: operadores[1].id,
    },
    {
      codigoCarga: 'CRG-2024-003',
      origemTexto: 'Curitiba, PR, Brasil',
      origemCidade: 'Curitiba',
      origemPais: 'Brasil',
      origemLat: -25.4284,
      origemLng: -49.2733,
      destinoTexto: 'Porto Alegre, RS, Brasil',
      destinoCidade: 'Porto Alegre',
      destinoPais: 'Brasil',
      destinoLat: -30.0346,
      destinoLng: -51.2177,
      dataSaida: new Date(now.getTime()),
      previsaoEntrega: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      statusAtual: 'INICIADA' as const,
      localAtualTexto: 'Curitiba, PR, Brasil',
      localAtualLat: -25.4284,
      localAtualLng: -49.2733,
      clienteId: clientes[2].id,
      operadorId: operadores[2].id,
    },
    {
      codigoCarga: 'CRG-2024-004',
      origemTexto: 'Brasília, DF, Brasil',
      origemCidade: 'Brasília',
      origemPais: 'Brasil',
      origemLat: -15.8267,
      origemLng: -47.9218,
      destinoTexto: 'Goiânia, GO, Brasil',
      destinoCidade: 'Goiânia',
      destinoPais: 'Brasil',
      destinoLat: -16.6869,
      destinoLng: -49.2648,
      dataSaida: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      previsaoEntrega: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      statusAtual: 'TRANSBORDO' as const,
      localAtualTexto: 'Anápolis, GO, Brasil',
      localAtualLat: -16.3281,
      localAtualLng: -48.9534,
      clienteId: clientes[3].id,
      operadorId: operadores[0].id,
    },
    {
      codigoCarga: 'CRG-2024-005',
      origemTexto: 'Recife, PE, Brasil',
      origemCidade: 'Recife',
      origemPais: 'Brasil',
      origemLat: -8.0476,
      origemLng: -34.877,
      destinoTexto: 'Fortaleza, CE, Brasil',
      destinoCidade: 'Fortaleza',
      destinoPais: 'Brasil',
      destinoLat: -3.7172,
      destinoLng: -38.5433,
      dataSaida: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      previsaoEntrega: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      statusAtual: 'CANCELADA' as const,
      localAtualTexto: 'Recife, PE, Brasil',
      localAtualLat: -8.0476,
      localAtualLng: -34.877,
      clienteId: clientes[4].id,
      operadorId: operadores[1].id,
    },
    {
      codigoCarga: 'CRG-2024-006',
      origemTexto: 'Manaus, AM, Brasil',
      origemCidade: 'Manaus',
      origemPais: 'Brasil',
      origemLat: -3.119,
      origemLng: -60.0217,
      destinoTexto: 'Belém, PA, Brasil',
      destinoCidade: 'Belém',
      destinoPais: 'Brasil',
      destinoLat: -1.4558,
      destinoLng: -48.5039,
      dataSaida: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      previsaoEntrega: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      statusAtual: 'EM_TRANSITO' as const,
      localAtualTexto: 'Santarém, PA, Brasil',
      localAtualLat: -2.4401,
      localAtualLng: -54.7088,
      clienteId: clientes[5].id,
      operadorId: operadores[2].id,
    },
    {
      codigoCarga: 'CRG-2024-007',
      origemTexto: 'Campinas, SP, Brasil',
      origemCidade: 'Campinas',
      origemPais: 'Brasil',
      origemLat: -22.9099,
      origemLng: -47.0626,
      destinoTexto: 'Santos, SP, Brasil',
      destinoCidade: 'Santos',
      destinoPais: 'Brasil',
      destinoLat: -23.9608,
      destinoLng: -46.3336,
      dataSaida: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      previsaoEntrega: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      statusAtual: 'ENTREGUE' as const,
      localAtualTexto: 'Santos, SP, Brasil',
      localAtualLat: -23.9608,
      localAtualLng: -46.3336,
      clienteId: clientes[6].id,
      operadorId: operadores[0].id,
    },
    {
      codigoCarga: 'CRG-2024-008',
      origemTexto: 'Florianópolis, SC, Brasil',
      origemCidade: 'Florianópolis',
      origemPais: 'Brasil',
      origemLat: -27.5954,
      origemLng: -48.548,
      destinoTexto: 'Joinville, SC, Brasil',
      destinoCidade: 'Joinville',
      destinoPais: 'Brasil',
      destinoLat: -26.3045,
      destinoLng: -48.8487,
      dataSaida: new Date(now.getTime()),
      previsaoEntrega: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      statusAtual: 'INICIADA' as const,
      localAtualTexto: 'Florianópolis, SC, Brasil',
      localAtualLat: -27.5954,
      localAtualLng: -48.548,
      clienteId: clientes[7].id,
      operadorId: operadores[1].id,
    },
    {
      codigoCarga: 'CRG-2024-009',
      origemTexto: 'Natal, RN, Brasil',
      origemCidade: 'Natal',
      origemPais: 'Brasil',
      origemLat: -5.7945,
      origemLng: -35.211,
      destinoTexto: 'João Pessoa, PB, Brasil',
      destinoCidade: 'João Pessoa',
      destinoPais: 'Brasil',
      destinoLat: -7.1195,
      destinoLng: -34.845,
      dataSaida: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      previsaoEntrega: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      statusAtual: 'EM_TRANSITO' as const,
      localAtualTexto: 'Campina Grande, PB, Brasil',
      localAtualLat: -7.2306,
      localAtualLng: -35.8811,
      clienteId: clientes[8].id,
      operadorId: operadores[2].id,
    },
    {
      codigoCarga: 'CRG-2024-010',
      origemTexto: 'Campo Grande, MS, Brasil',
      origemCidade: 'Campo Grande',
      origemPais: 'Brasil',
      origemLat: -20.4697,
      origemLng: -54.6201,
      destinoTexto: 'Cuiabá, MT, Brasil',
      destinoCidade: 'Cuiabá',
      destinoPais: 'Brasil',
      destinoLat: -15.601,
      destinoLng: -56.0974,
      dataSaida: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      previsaoEntrega: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      statusAtual: 'ENTREGUE' as const,
      localAtualTexto: 'Cuiabá, MT, Brasil',
      localAtualLat: -15.601,
      localAtualLng: -56.0974,
      clienteId: clientes[9].id,
      operadorId: operadores[0].id,
    },
  ];

  const extraViagens = 50;
  for (let i = 0; i < extraViagens; i++) {
    const origem = locais[i % locais.length];
    const destino = locais[(i + 3) % locais.length];
    const statusAtual = statusPool[i % statusPool.length];
    const hourOffset = (i * 3) % 24;
    const dataSaida = new Date(
      now.getTime() - (i % 14) * 24 * 60 * 60 * 1000 - hourOffset * 60 * 60 * 1000,
    );
    const previsaoEntrega = new Date(
      dataSaida.getTime() + (2 + (i % 6)) * 24 * 60 * 60 * 1000 + (i % 8) * 60 * 60 * 1000,
    );
    const midIndex = (i + 5) % locais.length;
    const fallbackIndex = (i + 7) % locais.length;
    const midLocal =
      locais[midIndex].texto === origem.texto || locais[midIndex].texto === destino.texto
        ? locais[fallbackIndex]
        : locais[midIndex];
    const localAtualBase =
      statusAtual === 'ENTREGUE'
        ? destino
        : statusAtual === 'CANCELADA' || statusAtual === 'INICIADA'
          ? origem
          : midLocal;

    viagensData.push({
      codigoCarga: `CRG-2024-${String(i + 11).padStart(3, '0')}`,
      origemTexto: origem.texto,
      origemCidade: origem.cidade,
      origemPais: origem.pais,
      origemLat: origem.lat,
      origemLng: origem.lng,
      destinoTexto: destino.texto,
      destinoCidade: destino.cidade,
      destinoPais: destino.pais,
      destinoLat: destino.lat,
      destinoLng: destino.lng,
      dataSaida,
      previsaoEntrega,
      statusAtual,
      localAtualTexto: localAtualBase.texto,
      localAtualLat: localAtualBase.lat,
      localAtualLng: localAtualBase.lng,
      clienteId: clientes[i % clientes.length].id,
      operadorId: operadores[i % operadores.length].id,
    });
  }

  const viagens = await Promise.all(viagensData.map((v) => prisma.viagem.create({ data: v })));

  // Criar Históricos
  console.log('📋 Criando históricos...');
  const historicosData = [];

  // Para cada viagem, criar históricos apropriados
  for (let i = 0; i < viagens.length; i++) {
    const viagem = viagens[i];

    // Histórico inicial - INICIADA
    historicosData.push({
      viagemId: viagem.id,
      status: 'INICIADA' as const,
      ocorridoEm: viagem.dataSaida,
      localTexto: viagem.origemTexto,
      lat: viagem.origemLat,
      lng: viagem.origemLng,
      observacoes: 'Carga registrada no sistema',
    });

    // Adicionar históricos intermediários baseado no status atual
    if (
      viagem.statusAtual === 'EM_TRANSITO' ||
      viagem.statusAtual === 'TRANSBORDO' ||
      viagem.statusAtual === 'ENTREGUE'
    ) {
      historicosData.push({
        viagemId: viagem.id,
        status: 'EM_TRANSITO' as const,
        ocorridoEm: new Date(viagem.dataSaida.getTime() + 6 * 60 * 60 * 1000), // 6h depois
        localTexto: viagem.localAtualTexto || viagem.origemTexto,
        lat: viagem.localAtualLat,
        lng: viagem.localAtualLng,
        observacoes: 'Carga em trânsito',
      });
    }

    if (viagem.statusAtual === 'TRANSBORDO') {
      historicosData.push({
        viagemId: viagem.id,
        status: 'TRANSBORDO' as const,
        ocorridoEm: new Date(viagem.dataSaida.getTime() + 12 * 60 * 60 * 1000),
        localTexto: viagem.localAtualTexto || viagem.origemTexto,
        lat: viagem.localAtualLat,
        lng: viagem.localAtualLng,
        observacoes: 'Carga em transbordo',
      });
    }

    if (viagem.statusAtual === 'ENTREGUE') {
      historicosData.push({
        viagemId: viagem.id,
        status: 'ENTREGUE' as const,
        ocorridoEm: viagem.previsaoEntrega,
        localTexto: viagem.destinoTexto,
        lat: viagem.destinoLat,
        lng: viagem.destinoLng,
        observacoes: 'Carga entregue no destino',
      });
    }

    if (viagem.statusAtual === 'CANCELADA') {
      historicosData.push({
        viagemId: viagem.id,
        status: 'CANCELADA' as const,
        ocorridoEm: new Date(viagem.dataSaida.getTime() + 2 * 60 * 60 * 1000),
        localTexto: viagem.origemTexto,
        lat: viagem.origemLat,
        lng: viagem.origemLng,
        observacoes: 'Carga cancelada pelo cliente',
      });
    }
  }

  await Promise.all(historicosData.map((h) => prisma.historicoMovimentacao.create({ data: h })));

  console.log('✅ Seed concluído com sucesso!');
  console.log(`   - ${1 + operadores.length} operadores criados`);
  console.log(`   - ${clientes.length} clientes criados`);
  console.log(`   - ${viagens.length} viagens criadas`);
  console.log(`   - ${historicosData.length} históricos criados`);
  console.log('\n📝 Credenciais de acesso:');
  console.log('   Admin: admin@local.com / admin123');
  console.log('   Operadores: joao@local.com, maria@local.com, pedro@local.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
