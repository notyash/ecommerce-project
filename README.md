# Ecommerce Platform

A full-stack ecommerce platform built for performance and correctness. The backend is written in Rust using Rocket.rs with type-safe database access via SQLx. The frontend is a React + TypeScript SPA with TanStack Router, TanStack Query, and Zustand for state management.

Built as a production-grade project — not a tutorial clone.

---

## Features

- **Authentication** — Full Google OAuth 2.0 flow with JWKS verification, JWT lifecycle management, encrypted private cookies, and server-side logout with a 24-hour TTL
- **Product Discovery** — Browse, search, and filter products with a responsive UI
- **Session Management** — Secure, stateful user sessions across requests
- **Cart** — In progress

---

## Stack

Frontend | React · TypeScript · TailwindCSS · TanStack Router · TanStack Query |

Backend | Rust · Rocket.rs · SQLx |

Database | PostgreSQL |

Infrastructure | Docker · Docker Compose |

---

## Setup

1. Clone the repo
2. `cp .env.example .env` and fill in credentials
3. `docker compose up --build`
4. `docker compose exec backend sqlx migrate run` — creates tables
5. `docker compose exec -T db psql -U <POSTGRES_USER> -d <POSTGRES_DB> < seed.sql` — seeds data

---

## Daily Development

```bash
docker compose up           # start everything
docker compose down         # stop everything
docker compose up --build   # after changing dependencies
docker compose logs -f backend  # debug backend
```
