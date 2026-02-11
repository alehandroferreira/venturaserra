# C4 — Nível 3: Componentes (Component)

Este diagrama detalha os componentes internos da API e o fluxo de dependências (Clean Architecture).

```mermaid
flowchart TB
  subgraph HTTP["HTTP (Express)"]
    routes["Routes"]
    controllers["Controllers"]
    middlewares["Middlewares<br/>authRequired, requireRole, errorHandler"]
    swagger["Swagger/OpenAPI<br/>/docs"]
  end

  subgraph APP["Application"]
    usecases["Use Cases<br/>RegisterCarga, UpdateStatus, ListCargas, etc."]
    dtos["DTOs / Contracts"]
    ports["Ports (Interfaces)<br/>ViagemRepo, ClienteRepo, OperadorRepo, GeocodingPort, LoggerPort"]
  end

  subgraph DOMAIN["Domain"]
    entities["Entities<br/>Viagem, Cliente, Operador, Historico"]
    rules["Domain Services<br/>StatusFlow, Normalization, DateRules"]
    errors["Domain Errors<br/>InvalidTransition, InvalidDates, NotFound"]
  end

  subgraph INFRA["Infrastructure"]
    prismaRepo["Prisma Repositories<br/>(implements Ports)"]
    prismaClient["Prisma Client"]
    geoClient["Geocoding HTTP Client<br/>(Nominatim)"]
    jwtAdapter["JWT Adapter"]
    logger["Pino Logger Adapter"]
    sql[(SQL Server)]
  end

  routes --> controllers --> usecases
  middlewares --> controllers
  swagger --> routes

  controllers --> dtos
  usecases --> ports
  usecases --> rules
  usecases --> entities
  rules --> errors

  ports --> prismaRepo
  prismaRepo --> prismaClient --> sql

  ports --> geoClient
  controllers --> jwtAdapter
  usecases --> logger
```

## Regras de dependência

- `domain` **não depende** de Express/Prisma.
- `application` depende de `domain` e **ports**.
- `infrastructure` implementa as **ports** (Prisma, HTTP, JWT, logs).
