# Quality Inspection Tracker - Arvind Fabric Manufacturing

A mobile-first web application for shop-floor supervisors at Arvind fabric manufacturing plants across Gujarat (Naroda, Khatraj) and Maharashtra (Nagpur) to log, track, resolve, and analyze fabric quality defects in real time.

---

## 🚀 Quickstart Guide

### Option 1: Instant Zero-Config Local Setup (SQLite - Default)
*Ideal for fast evaluation without installing PostgreSQL or Docker.*

1. **Run Database Migrations & Seeders:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

2. **Start Application:**
   ```bash
   npm run start
   ```

3. Open **`http://localhost:3001`** in your browser.

---

### Option 2: Using PostgreSQL (If local PostgreSQL server is installed)

1. Set `DB_DIALECT=postgres` in `server/.env`:
   ```env
   DB_DIALECT=postgres
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=arvind_quality_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

2. **Run Migrations & Seeders on PostgreSQL:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Start Application:**
   ```bash
   npm run start
   ```

---

### Option 3: Using Docker Compose (If Docker Desktop is installed)

```bash
docker compose up --build
```
Access at **`http://localhost:3000`**.

---

## 🔐 Default Authentication Credentials

| Role | Username | Password | Default Plant Location |
| :--- | :--- | :--- | :--- |
| **Shop-floor Supervisor** | `supervisor` | `arvind123` | Naroda Plant, Gujarat |
| **Quality Manager** | `quality_mgr` | `arvind123` | Nagpur Plant, Maharashtra |

---

## 🗄️ Database & Environment Architecture (Sequelize CLI)

The application supports both **SQLite** and **PostgreSQL** via **Sequelize ORM** with standard CLI migrations and seeders:

- **`server/.env`**: Controls active database dialect (`DB_DIALECT=sqlite` or `DB_DIALECT=postgres`).
- **`server/config/config.js`**: Sequelize CLI dynamic configuration.
- **`server/models/`**: `User` (`user.js`) and `Inspection` (`inspection.js`) models.
- **`server/migrations/`**: Explicit database schema migration files.
- **`server/seeders/`**: Explicit initial data seeder files.

### Database Commands

| Command | Action |
| :--- | :--- |
| `npm run db:migrate` | Runs database migrations |
| `npm run db:seed` | Seeds initial shop-floor defect logs & user accounts |
| `npm run db:migrate:undo` | Reverts last migration |
| `npm test` | Runs automated verification test suite |

---

## 🔌 Mock SAP Webhook Endpoint (`POST /api/sap-webhook`)

The application exposes a REST endpoint at **`POST /api/sap-webhook`** to receive automated quality alerts from SAP ERP / Quality Management (QM) module optical sensors and spectrophotometers.

### Expected Payload Shape

```json
{
  "notificationHeader": {
    "sapNotificationId": "QM-2026-99104",
    "plantId": "NARODA-01",
    "plantName": "Naroda Plant, Ahmedabad",
    "workCenter": "Loom-104 (Denim Line 1)",
    "timestamp": "2026-07-30T10:15:00Z"
  },
  "defectDetails": {
    "code": "WEAVE_WARP_BREAK",
    "category": "Weave Defect",
    "severityLevel": "HIGH",
    "description": "Auto optical yarn sensor detected 6 warp end breaks on high-speed loom."
  }
}
```

---

## ⚡ Core Features Implemented

1. **Log New Inspection:** Date picker, Machine ID free text, Defect type dropdown, Severity chips, Remarks.
2. **Filterable & Sortable List:** Filter by Severity, Status, Date Range, and Search. Sort by date or severity.
3. **Mark Inspection as Resolved:** Mandatory resolution note validation.
4. **Summary View Matrix:** 2x3 summary table of Open vs. Resolved counts by severity.
5. **Bonus Features:** Offline queue with auto-sync, Mock SAP Webhook, JWT Auth with HTTP-Only session cookies, CSV export.