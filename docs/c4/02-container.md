# C4 — Nível 2: Containers

Este diagrama mostra os principais **containers/blocos executáveis** e como se comunicam.

```mermaid
flowchart LR
  subgraph App["Tracking API (Aplicação)"]
    http["HTTP API<br/>Express Router + Controllers"]
    auth["Auth<br/>JWT + RBAC"]
    val["Validation<br/>Zod Schemas"]
    uc["Application Layer<br/>Use Cases"]
    dom["Domain Layer<br/>Rules/Services"]
    repoPorts["Ports<br/>Repository & Geocoding Interfaces"]
    prisma["DB Adapter<br/>Prisma Client"]
    log["Logging<br/>Pino"]
  end

  db[(SQL Server)]
  geocode["Geocoding API<br/>(OpenStreetMap Nominatim)"]

  http --> val --> uc --> dom
  uc --> repoPorts
  repoPorts --> prisma --> db
  repoPorts --> geocode

  http --> auth
  http --> log
  uc --> log
```

## Notas

- **Container** aqui é o executável principal (a API). As caixas internas representam componentes relevantes, mas sem detalhar a estrutura de código.
- A camada de aplicação depende de **ports** (interfaces) e não de implementações (Prisma/HTTP).
