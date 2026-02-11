# (Opcional) Modelo Analítico — Tabela Fato para BI/Analytics

Objetivo: suportar análises de **SLA**, **atrasos**, **tempo por status**, **performance por rota/cliente**.

```mermaid
flowchart TB
  subgraph Dimensoes["Dimensões (exemplo)"]
    dimTempo[DimTempo]
    dimCliente[DimCliente]
    dimOperador[DimOperador]
    dimStatus[DimStatus]
    dimOrigem["DimLocal (Origem)"]
    dimDestino["DimLocal (Destino)"]
  end

  fato["FatoMovimentacao<br/>(grain: 1 linha por evento do histórico)"]

  dimTempo --> fato
  dimCliente --> fato
  dimOperador --> fato
  dimStatus --> fato
  dimOrigem --> fato
  dimDestino --> fato
```

## FatoMovimentacao (exemplo de colunas)

- `movimentacaoId` (degenerate / referência ao evento)
- `dataKey`, `clienteKey`, `operadorKey`, `statusKey`, `origemKey`, `destinoKey`
- Medidas:
  - `leadTimeMinutos` (do embarque até entrega, quando aplicável)
  - `atrasoMinutos` (diferença entre previsaoEntrega e entrega real)
  - `tempoNoStatusMinutos` (tempo até o próximo evento)

## Justificativa

- Permite agregações por período, cliente, operador, rota e status sem afetar o OLTP.
