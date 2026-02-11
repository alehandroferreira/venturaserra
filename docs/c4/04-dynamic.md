# C4 — Nível 4: Dinâmica (Dynamic)

Cenário: **PUT /tracking/{codigoCarga}/status**  
Objetivo: atualizar status + localização atual e **registrar automaticamente** no histórico.

```mermaid
sequenceDiagram
  autonumber
  participant C as Cliente HTTP (Controller)
  participant A as Auth Middleware (JWT)
  participant Z as Zod Validation
  participant U as UpdateStatusUseCase
  participant D as Domain (StatusFlow)
  participant G as GeocodingPort (Nominatim Adapter)
  participant R as ViagemRepository (Prisma)
  participant H as HistoricoRepository (Prisma)
  participant DB as SQL Server

  C->>A: valida JWT / role
  A-->>C: ok
  C->>Z: valida body/params (novoStatus, localTexto, observacoes?)
  Z-->>C: ok
  C->>U: execute(codigoCarga, novoStatus, localTexto, ...)
  U->>R: findByCodigo(codigoCarga)
  R->>DB: SELECT Viagem ...
  DB-->>R: viagem(statusAtual, ...)
  R-->>U: viagem
  U->>D: assertValidTransition(statusAtual, novoStatus)
  D-->>U: ok
  U->>G: geocode(localTexto)
  G-->>U: {lat,lng}
  U->>R: updateStatusAndLocation(...)
  R->>DB: UPDATE Viagem SET statusAtual, localAtualLat/Lng/Text ...
  DB-->>R: ok
  U->>H: createHistorico(...)
  H->>DB: INSERT HistoricoMovimentacao (...)
  DB-->>H: ok
  U-->>C: sucesso
```

## Invariantes garantidos
- Transição inválida é bloqueada (ex.: **ENTREGUE -> EM_TRANSITO**).
- Cada atualização de status gera um registro em `HistoricoMovimentacao` automaticamente.
