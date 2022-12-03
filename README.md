# 92534

# Environment

These are the contents of the `packages/api/.env` file. Use the Postgres credentials to inspect the database in pgadmin.

```
POSTGRES_DB=92534
POSTGRES_USER=92534
POSTGRES_PASSWORD=92534
POSTGRES_HOST=0.0.0.0
POSTGRES_PORT=5432
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
```

# Usage

To run the project, run the following commands in your terminal

```
# Install Dependencies
npm install && \
    # Start postgres
    docker compose -f ./packages/api/docker-compose.yml up -d && \
    # Install migrations
    npx -w @92534/api prisma migrate dev && \
    # Start API & Client
    npm start
```

You can now access the projects which are running on the following ports: - Client: http://localhost:3000 - Server: http://localhost:4000

# User Stories

- [x] As a user, I want to navigate a web-based application, so that I can find events of interest

  **User can navigate a list and detail view of the the events at http://localhost:3000**

- [x] As a user, I want to save the data retrieved from the REST APIs to a database for further processing

  **Data is downloaded from `api.open511.gov.bc.ca` when the server starts, and fetches changes every minute (REMOTE updated_at > LOCAL last_updated_at)**

- [x] As a user, I want to filter out events by

  - [x] Area
  - [x] Severity
  - [x] Event Type
  - [x] Start Date

  **Filters on the list view provide this functionality**

- [x] As a user, I want to provide two REST API endpoints to give data access to other applications. The rest endpoints include:

  - [x] Creating new events
  - [x] Getting highest severity events by Areas

    **Please import the attached `92534.postman_collection.json` and see the `92534/V0/Events/Create` and `92534/V0/Events/Views/Major Events` endpoints. Entries for the other endpoints are included.**

- [x] As a user, I want to monitor API usage data based on the API calls from other applications

  **The `.../Create` and `.../Major Events` endpoints require an API Key to use. Usage data is stored in the `TokenLog` table in the database, accessible by PGAdmin**
