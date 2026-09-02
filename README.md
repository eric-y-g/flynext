# FlyNext

FlyNext is a full-stack travel booking application for finding and booking flights and hotels in one place. Customers can build a combined itinerary, check out once, and manage their bookings, while hotel owners can publish and operate their properties.

The application was built with Next.js, React, TypeScript, Prisma, PostgreSQL, and Tailwind CSS. Flight data and booking operations are provided by the Advanced Flights System (AFS), and Cloudinary stores uploaded hotel, room, and profile images.

## Features

### For travellers

- Register, sign in, update a profile, and upload a profile picture
- Search one-way and round-trip flights by city, airport, and date
- Browse hotels and find rooms available for selected dates
- Add flights and hotel rooms to a shared cart
- Check out a complete itinerary and receive an invoice
- View or cancel existing flight and hotel bookings
- Look up a flight booking by booking ID and passenger last name
- Receive booking and cancellation notifications
- Switch between light and dark themes

### For hotel owners

- Add hotels and upload property images
- Define room types, amenities, nightly prices, and room images
- Add individual rooms and control room availability
- Review bookings for a property
- Deactivate or restore rooms; affected guests are notified when applicable

## Tech stack

| Area | Technology |
| --- | --- |
| Web application | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS |
| API | Next.js route handlers, Axios |
| Database | PostgreSQL, Prisma ORM |
| Authentication | JWT access/refresh tokens, bcrypt |
| Flight integration | Advanced Flights System API |
| Image storage | Cloudinary |
| Deployment | Docker, Docker Compose |

## Getting started with Docker

### Prerequisites

- Docker Desktop (or Docker Engine with Docker Compose)
- An AFS API key for flight search and booking
- A Cloudinary account if image uploads are required

From the repository root, configure the environment values under the `app` service in `docker-compose.yml`, then start the application and PostgreSQL:

```bash
docker compose up --build -d
```

Docker applies the Prisma migrations when the app container starts. Once both services are healthy, open [http://localhost:3000](http://localhost:3000).

To populate the database with sample hotels, rooms, cities, and airports, run the optional seed script once:

```bash
docker compose exec app node seed.js
```

The seed script is not designed to be rerun against an already populated database. Stop the services with:

```bash
docker compose down
```

To also remove the PostgreSQL volume and all local application data, use `docker compose down -v`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `ACCESS_TOKEN_SECRET` | Yes | Signs short-lived access tokens |
| `REFRESH_TOKEN_SECRET` | Yes | Signs refresh tokens |
| `AFS_API_KEY` | Yes | Authenticates requests to the AFS flight API |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary account name |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary API secret |
| `NEXT_PUBLIC_BASE_URL` | Yes | Public origin used for server-side calls during checkout (for example, `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | No | Overrides the browser API base URL; defaults to `/api` |

Use long, independent random values for both JWT secrets. Do not commit production credentials. Rotate any credentials that have previously been committed before deploying or sharing the repository.

## Local development without Docker

1. Start a PostgreSQL instance and create a database.
2. In `flynext/`, create a local environment file containing the variables listed above.
3. Install dependencies and prepare the database:

   ```bash
   cd flynext
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The site will be available at [http://localhost:3000](http://localhost:3000). If PostgreSQL is running through this repository's Compose configuration while the app runs on the host, connect to port `5433` rather than the container-only port `5432`.

## Useful commands

Run these commands from `flynext/` unless noted otherwise.

```bash
npm run dev       # Start the Next.js development server
npm run build     # Create a production build
npm run start     # Start a previously built production server
npx prisma studio # Inspect local database records
```

## Project structure

```text
.
├── docker-compose.yml       # App and PostgreSQL services
├── README.md
└── flynext/
    ├── app/                 # Pages and API route handlers
    ├── components/          # Shared interface components
    ├── hooks/               # Authentication and theme hooks
    ├── prisma/              # Database schema and migrations
    ├── public/              # Static assets
    ├── utils/               # API, authentication, and database helpers
    ├── postman_collection.json
    ├── seed.js              # Optional development data import
    └── Dockerfile
```

## API reference

The application exposes route handlers under `/api` for authentication, users, hotels, flights, carts, bookings, invoices, notifications, and image uploads. Import `flynext/postman_collection.json` into Postman for example requests and endpoint documentation.

Most account, cart, booking, hotel-management, notification, and invoice endpoints require an access token in the following header:

```http
Authorization: Bearer <access-token>
```

The browser client stores the access token locally and sends the refresh-token cookie automatically.
