# DER — Modelo Relacional (SQL Server)

```mermaid
erDiagram
  CLIENTE ||--o{ VIAGEM : "contrata"
  OPERADOR ||--o{ VIAGEM : "registra/gerencia"
  VIAGEM ||--o{ HISTORICO_MOVIMENTACAO : "gera"

  CLIENTE {
    string id PK
    string nome
    string email
    string telefone
    datetime createdAt
    datetime updatedAt
  }

  OPERADOR {
    string id PK
    string nome
    string email UK
    string passwordHash
    string role
    datetime createdAt
    datetime updatedAt
  }

  VIAGEM {
    string id PK
    string codigoCarga UK
    string statusAtual
    string origemTexto
    string origemCidade
    string origemPais
    float  origemLat
    float  origemLng
    string destinoTexto
    string destinoCidade
    string destinoPais
    float  destinoLat
    float  destinoLng
    datetime dataSaida
    datetime previsaoEntrega
    string localAtualTexto
    float  localAtualLat
    float  localAtualLng
    string clienteId FK
    string operadorId FK
    datetime createdAt
    datetime updatedAt
  }

  HISTORICO_MOVIMENTACAO {
    string id PK
    string viagemId FK
    string status
    datetime ocorridoEm
    string localTexto
    float lat
    float lng
    string observacoes
  }
```

## Índices recomendados
- `VIAGEM(codigoCarga)` UNIQUE
- `VIAGEM(statusAtual)`, `VIAGEM(clienteId)`, `VIAGEM(operadorId)`, `VIAGEM(dataSaida)`
- `HISTORICO_MOVIMENTACAO(viagemId, ocorridoEm)` para ordenação por histórico
