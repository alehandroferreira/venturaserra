# C4 — Deployment (Ambiente Local com Docker)

Este diagrama descreve o ambiente de execução local recomendado para desenvolvimento e demonstração.

```mermaid
flowchart LR
  dev["Developer Machine"]

  subgraph Docker["Docker Compose"]
    api["API Container<br/>Node.js + Express + Prisma"]
    db[("SQL Server Container<br/>:1433")]
  end

  geo["Geocoding API<br/>OpenStreetMap Nominatim<br/>(externo)"]

  dev -->|HTTP :3000| api
  api -->|TCP :1433| db
  api -->|HTTPS| geo
```

## Notas

- O SQL Server roda em container via `docker-compose.yml`.
- A API pode rodar localmente (node) ou em container (opcional). Para o teste, basta rodar local e apontar para o DB do compose.
