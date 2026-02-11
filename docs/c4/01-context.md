# C4 — Nível 1: Contexto (System Context)

Este diagrama mostra **quem usa** o sistema e **quais sistemas externos** ele integra.

```mermaid
flowchart LR
  %% People
  cliente["Cliente (empresa)"]
  operador["Operador / Usuário"]
  admin["Administrador"]

  %% System
  api["Tracking API<br/>(Node.js + Express)"]

  %% External systems
  geocode["Geocoding API<br/>(OpenStreetMap Nominatim)"]
  db[(SQL Server)]

  cliente -->|Consulta status e histórico| api
  operador -->|Cadastra e atualiza cargas| api
  admin -->|Auditoria e operações internas| api

  api -->|Geocodifica origem/destino/localização| geocode
  api -->|Persistência de dados| db
```

## Notas

- O **Geocoding API** é um sistema externo usado para obter **latitude/longitude** a partir de endereços/locais em texto.
- O **SQL Server** armazena clientes, operadores, viagens/cargas e histórico de movimentações.
