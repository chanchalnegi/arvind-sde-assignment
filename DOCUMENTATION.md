# Arvind Quality Inspection Tracker - Project Documentation & Guide

This document provides a comprehensive explanation of the assignment requirements, business problem context, architectural choices, code implementation, and instructions for running and testing the application.

---

## 1. Problem Context & Business Objective

Arvind operates major fabric manufacturing plants across **Gujarat** (Naroda, Khatraj) and **Maharashtra** (Nagpur). Shop-floor supervisors previously logged fabric quality defects manually in paper registers. These paper logs were transferred into spreadsheets days after the fact, causing delays in identifying machine flaws, dye shade shifts, and yarn tension issues.

### The Assignment Goal
Build a lightweight, mobile-first **Quality Inspection Tracker** web application that shop-floor supervisors can use on mobile phone browsers to:
1. Log defects in real-time right at the machine/loom.
2. Filter, search, and track open vs. resolved defects.
3. Mark defects as resolved with mandatory corrective action notes.
4. View an executive summary table of defect counts broken down by severity level.

---

## 2. Setup & Execution Instructions

### Option 1: Instant Zero-Config Setup (SQLite - Default)
*Ideal for fast local evaluation without installing external database software.*

```bash
npm run db:migrate
npm run db:seed
npm run start
```
Access at **`http://localhost:3001`**.

---

### Option 2: Using PostgreSQL Server
*For running with a local PostgreSQL server instance.*

1. In `server/.env`, set `DB_DIALECT=postgres` and your PostgreSQL credentials:
   ```env
   DB_DIALECT=postgres
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=arvind_quality_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

2. Run migrations and start:
   ```bash
   npm run db:migrate
   npm run db:seed
   npm run start
   ```

---

### Option 3: Using Docker Compose
```bash
docker compose up --build
```
Access at **`http://localhost:3000`**.

---

## 3. Requirements vs. What We Built

| Requirement | Description in Assignment | How We Implemented It | File Reference |
| :--- | :--- | :--- | :--- |
| **Log Inspection** | Date, Machine/Line ID (free text), Defect Type dropdown (`Weave Defect`, `Shade Variation`, `Hole/Tear`, `Count Deviation`, `Other`), Severity (`Critical` / `Major` / `Minor`), Remarks (optional). | Mobile-optimized modal form with date picker, free text input with suggestions, exact defect dropdown, severity chips, and remarks text area. | [NewInspectionModal.jsx](file:///Users/chanchalnegi/Documents/arvind-sde-assignment/arvind-sde-assignment/client/src/components/NewInspectionModal.jsx) |
| **Sortable & Filterable List** | Filter by severity, status (`Open` / `Resolved`), date range (`From Date` to `To Date`). Sortable list. | Multi-filter control bar with search input, dropdowns for severity/status, date pickers, and sorting controls. | [FilterBar.jsx](file:///Users/chanchalnegi/Documents/arvind-sde-assignment/arvind-sde-assignment/client/src/components/FilterBar.jsx) & [InspectionList.jsx](file:///Users/chanchalnegi/Documents/arvind-sde-assignment/arvind-sde-assignment/client/src/components/InspectionList.jsx) |
| **Mark as Resolved** | Requires a **mandatory resolution note**. | Resolution modal enforcing non-empty notes. Backend API validation returning `400 Bad Request` if note is missing. | [ResolveModal.jsx](file:///Users/chanchalnegi/Documents/arvind-sde-assignment/arvind-sde-assignment/client/src/components/ResolveModal.jsx) & [inspections.js](file:///Users/chanchalnegi/Documents/arvind-sde-assignment/arvind-sde-assignment/server/src/routes/inspections.js#L171-L179) |
| **Summary View** | Count of Open and Resolved inspections by severity (table or cards). | KPI metric cards + a 2x3 summary table matrix displaying Open vs. Resolved counts for Critical, Major, and Minor severities. | [SummaryView.jsx](file:///Users/chanchalnegi/Documents/arvind-sde-assignment/arvind-sde-assignment/client/src/components/SummaryView.jsx) |

---

## 4. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint. |
| `POST` | `/api/auth/login` | Authenticates supervisor/manager and sets HTTP-Only session cookie. |
| `POST` | `/api/auth/logout` | Clears HTTP-Only session cookie. |
| `GET` | `/api/inspections` | Fetches filtered & sorted inspection records. |
| `POST` | `/api/inspections` | Creates a new quality inspection record. |
| `PATCH` | `/api/inspections/:id/resolve` | Marks an inspection as resolved with mandatory `resolution_note`. |
| `GET` | `/api/inspections/summary` | Returns metrics and 2x3 matrix breakdown (Open/Resolved counts by severity). |
| `POST` | `/api/sap-webhook` | Ingests SAP QM alerts and auto-creates an inspection record. |
| `GET` | `/api/inspections/export` | Downloads inspection records as a `.csv` spreadsheet. |
