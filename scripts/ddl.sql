-- DDL - SQL Server

CREATE TABLE dbo.clientes (
  id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
  nome NVARCHAR(200) NOT NULL,
  email NVARCHAR(200) NULL,
  telefone NVARCHAR(50) NULL,
  createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_clientes PRIMARY KEY (id)
);

CREATE TABLE dbo.operadores (
  id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
  nome NVARCHAR(200) NOT NULL,
  email NVARCHAR(200) NOT NULL,
  passwordHash NVARCHAR(255) NOT NULL,
  role NVARCHAR(20) NOT NULL DEFAULT 'OPERATOR',
  createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_operadores PRIMARY KEY (id),
  CONSTRAINT UQ_operadores_email UNIQUE (email),
  CONSTRAINT CK_operadores_role CHECK (role IN ('ADMIN', 'OPERATOR'))
);

CREATE TABLE dbo.viagens (
  id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
  codigoCarga NVARCHAR(50) NOT NULL,
  origemTexto NVARCHAR(300) NOT NULL,
  origemCidade NVARCHAR(120) NULL,
  origemPais NVARCHAR(120) NULL,
  origemLat FLOAT NULL,
  origemLng FLOAT NULL,
  destinoTexto NVARCHAR(300) NOT NULL,
  destinoCidade NVARCHAR(120) NULL,
  destinoPais NVARCHAR(120) NULL,
  destinoLat FLOAT NULL,
  destinoLng FLOAT NULL,
  dataSaida DATETIME2 NOT NULL,
  previsaoEntrega DATETIME2 NOT NULL,
  clienteId UNIQUEIDENTIFIER NOT NULL,
  operadorId UNIQUEIDENTIFIER NOT NULL,
  statusAtual NVARCHAR(20) NOT NULL DEFAULT 'INICIADA',
  localAtualTexto NVARCHAR(300) NULL,
  localAtualLat FLOAT NULL,
  localAtualLng FLOAT NULL,
  createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_viagens PRIMARY KEY (id),
  CONSTRAINT UQ_viagens_codigoCarga UNIQUE (codigoCarga),
  CONSTRAINT FK_viagens_clientes FOREIGN KEY (clienteId) REFERENCES dbo.clientes (id) ON DELETE CASCADE,
  CONSTRAINT FK_viagens_operadores FOREIGN KEY (operadorId) REFERENCES dbo.operadores (id),
  CONSTRAINT CK_viagens_status CHECK (statusAtual IN ('INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA')),
  CONSTRAINT CK_viagens_previsao CHECK (previsaoEntrega >= dataSaida)
);

CREATE TABLE dbo.historico_movimentacoes (
  id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
  viagemId UNIQUEIDENTIFIER NOT NULL,
  status NVARCHAR(20) NOT NULL,
  ocorridoEm DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  localTexto NVARCHAR(300) NOT NULL,
  lat FLOAT NULL,
  lng FLOAT NULL,
  observacoes NVARCHAR(500) NULL,
  CONSTRAINT PK_historico_movimentacoes PRIMARY KEY (id),
  CONSTRAINT FK_historico_viagens FOREIGN KEY (viagemId) REFERENCES dbo.viagens (id) ON DELETE CASCADE,
  CONSTRAINT CK_historico_status CHECK (status IN ('INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'))
);

CREATE INDEX IX_viagens_codigoCarga ON dbo.viagens (codigoCarga);
CREATE INDEX IX_viagens_clienteId ON dbo.viagens (clienteId);
CREATE INDEX IX_viagens_operadorId ON dbo.viagens (operadorId);
CREATE INDEX IX_viagens_statusAtual ON dbo.viagens (statusAtual);
CREATE INDEX IX_viagens_dataSaida ON dbo.viagens (dataSaida);
CREATE INDEX IX_viagens_previsaoEntrega ON dbo.viagens (previsaoEntrega);
CREATE INDEX IX_historico_viagemId ON dbo.historico_movimentacoes (viagemId);
CREATE INDEX IX_historico_ocorridoEm ON dbo.historico_movimentacoes (ocorridoEm);
