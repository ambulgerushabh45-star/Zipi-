# ZIPI Drones & Controls Backend (Enquiries & Orders)

Lightweight Node 18+ ESM Express & MongoDB (Mongoose) backend for **ZIPI Drones & Controls** contact enquiries, checkout orders, supervisor email notifications (Nodemailer + Gmail SMTP), and supervisor management.

## Installation & Configuration

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/zipi
CLIENT_ORIGIN=http://localhost:5174
ADMIN_KEY=zipi-supervisor-dev-key-change-me

# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SUPERVISOR_EMAIL=supervisor@zipi.aero

SEND_CUSTOMER_CONFIRMATION=false
```

### Gmail App Password Setup
1. Log in to your Google Account and navigate to **Security** (or go to [https://myaccount.google.com/security](https://myaccount.google.com/security)).
2. Ensure **2-Step Verification** is turned ON.
3. Open [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
4. Create a new App Password named e.g. `ZIPI Server`.
5. Copy the 16-character code into `server/.env` as `SMTP_PASS` (remove any spaces).
6. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, and `SMTP_USER` to your Gmail address.
7. Set `SUPERVISOR_EMAIL` to the recipient address (or multiple comma-separated addresses).

## Testing SMTP Connection

Test your SMTP configuration and send a live verification email to `SUPERVISOR_EMAIL`:

```bash
npm run test:mail
```

## Running the Server

```bash
# Development (Node watch mode)
npm run dev

# Production
npm start
```

> **Note:** Node `--watch` restarts when code changes, but does not restart on `.env` file changes. If you modify `.env`, restart the server process manually.

## API Endpoints

### Public Endpoints
| Method | Path | Limit | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server and MongoDB connection status (`{ ok, db }`). |
| `POST` | `/api/inquiries` | 10 req / 15m / IP, 50kb JSON | Validates, saves enquiry to MongoDB (`ZP-XXXXXX`), and dispatches email to supervisor. |
| `POST` | `/api/orders` | 10 req / 15m / IP, 50kb JSON | Validates, saves checkout order to MongoDB (`ZO-XXXXXX`), and dispatches email to supervisor. |

### Supervisor / Admin Endpoints (Header `x-admin-key: <ADMIN_KEY>`)
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/inquiries` | Admin key | Paginated enquiry list (`status`, `type`, `q`, `page`, `limit`). |
| `PATCH` | `/api/admin/inquiries/:ref` | Admin key | Update enquiry `status` (`pending_supervisor`, `in_review`, `replied`, `closed`) and `supervisorNotes`. |
| `GET` | `/api/admin/orders` | Admin key | Paginated orders list (`status`, `q`, `page`, `limit`). |
| `PATCH` | `/api/admin/orders/:ref` | Admin key | Update order `status` (`pending_supervisor`, `confirmed`, `shipped`, `cancelled`) and `supervisorNotes`. |
