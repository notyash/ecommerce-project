# Ecommerce Project

## Setup
1. Clone the repo
2. `cp .env.example .env` and fill in credentials
3. `docker compose up --build`
4. `docker compose exec backend sqlx migrate run`- creates tables
5. `docker compose exec -T db psql -U <POSTGRES_USER> -d <POSTGRES_DB> < seed.sql` - dumps data into tables

## Daily Development
```bash
docker compose up          # start everything
docker compose down        # stop everything
docker compose up --build  # after changing dependencies
docker compose logs -f backend  # debug backend
```
 
## Stack
- Frontend: React + TypeScript + TailwindCSS + Tanstack START
- Backend: Main - Rocket.rs (Rust) Initial - Python
- Database: PostgreSQL
