BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[clientes] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [telefone] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [clientes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [clientes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[operadores] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [passwordHash] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [operadores_role_df] DEFAULT 'OPERATOR',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [operadores_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [operadores_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [operadores_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[viagens] (
    [id] NVARCHAR(1000) NOT NULL,
    [codigoCarga] NVARCHAR(1000) NOT NULL,
    [origemTexto] NVARCHAR(1000) NOT NULL,
    [origemCidade] NVARCHAR(1000),
    [origemPais] NVARCHAR(1000),
    [origemLat] FLOAT(53),
    [origemLng] FLOAT(53),
    [destinoTexto] NVARCHAR(1000) NOT NULL,
    [destinoCidade] NVARCHAR(1000),
    [destinoPais] NVARCHAR(1000),
    [destinoLat] FLOAT(53),
    [destinoLng] FLOAT(53),
    [dataSaida] DATETIME2 NOT NULL,
    [previsaoEntrega] DATETIME2 NOT NULL,
    [clienteId] NVARCHAR(1000) NOT NULL,
    [operadorId] NVARCHAR(1000) NOT NULL,
    [statusAtual] NVARCHAR(1000) NOT NULL CONSTRAINT [viagens_statusAtual_df] DEFAULT 'INICIADA',
    [localAtualTexto] NVARCHAR(1000),
    [localAtualLat] FLOAT(53),
    [localAtualLng] FLOAT(53),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [viagens_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [viagens_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [viagens_codigoCarga_key] UNIQUE NONCLUSTERED ([codigoCarga])
);

-- CreateTable
CREATE TABLE [dbo].[historico_movimentacoes] (
    [id] NVARCHAR(1000) NOT NULL,
    [viagemId] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [ocorridoEm] DATETIME2 NOT NULL CONSTRAINT [historico_movimentacoes_ocorridoEm_df] DEFAULT CURRENT_TIMESTAMP,
    [localTexto] NVARCHAR(1000) NOT NULL,
    [lat] FLOAT(53),
    [lng] FLOAT(53),
    [observacoes] NVARCHAR(1000),
    CONSTRAINT [historico_movimentacoes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [operadores_email_idx] ON [dbo].[operadores]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [viagens_codigoCarga_idx] ON [dbo].[viagens]([codigoCarga]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [viagens_clienteId_idx] ON [dbo].[viagens]([clienteId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [viagens_operadorId_idx] ON [dbo].[viagens]([operadorId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [viagens_statusAtual_idx] ON [dbo].[viagens]([statusAtual]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [viagens_dataSaida_idx] ON [dbo].[viagens]([dataSaida]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [viagens_previsaoEntrega_idx] ON [dbo].[viagens]([previsaoEntrega]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [historico_movimentacoes_viagemId_idx] ON [dbo].[historico_movimentacoes]([viagemId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [historico_movimentacoes_ocorridoEm_idx] ON [dbo].[historico_movimentacoes]([ocorridoEm]);

-- AddForeignKey
ALTER TABLE [dbo].[viagens] ADD CONSTRAINT [viagens_clienteId_fkey] FOREIGN KEY ([clienteId]) REFERENCES [dbo].[clientes]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[viagens] ADD CONSTRAINT [viagens_operadorId_fkey] FOREIGN KEY ([operadorId]) REFERENCES [dbo].[operadores]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[historico_movimentacoes] ADD CONSTRAINT [historico_movimentacoes_viagemId_fkey] FOREIGN KEY ([viagemId]) REFERENCES [dbo].[viagens]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
