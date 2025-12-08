# FlexibleGantt

Flexible Gantt Chart Report System with customizable timeline, structure, and attributes.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm

### Installation

1. Clone the repository
```bash
cd C:\Workspace\FlexibleGantt
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
# .env file is already configured
# Default settings:
PORT=6001
DB_NAME=flexiblegantt
DB_USER=postgres
DB_PASSWORD=postgres
```

4. Setup database (Already done!)
```bash
# Database created: flexiblegantt
# Table created: tasks (18 attributes)
# Initial data: 25 tasks inserted
```

5. Start development server
```bash
npm run dev
```

Server will run on: **http://localhost:6001**

---

## 📡 API Endpoints

### Base URL
```
http://localhost:6001
```

### Health Check
```bash
GET  /                    # Server info
GET  /api/health          # Health check
```

### Tasks API

#### Get All Tasks
```bash
GET  /api/tasks

Response:
{
  "success": true,
  "count": 25,
  "data": [...]
}
```

#### Get Single Task
```bash
GET  /api/tasks/:id

Response:
{
  "success": true,
  "data": {...}
}
```

#### Create Task
```bash
POST /api/tasks
Content-Type: application/json

Body:
{
  "startDate": "2022-01-15",
  "endDate": "2022-06-30",
  "productType": "LPDDR5",
  "density": "16Gb",
  "process": "D1",
  "isMainProcess": "모제품",
  "isNPI": "Yes",
  "organization": "x4",
  "stackMethod": "TSV",
  "numberOfStack": "4H",
  "numberOfDie": "SDP",
  "packageSize": 12.50,
  "packageHeight": 1.20,
  "vdd1": 1.10,
  "vdd2": 1.05,
  "vddq": 1.20,
  "speed": 3200.00
}
```

#### Update Task
```bash
PUT  /api/tasks/:id
Content-Type: application/json

Body: (same as POST)
```

#### Delete Task
```bash
DELETE /api/tasks/:id

Response:
{
  "success": true,
  "message": "Task deleted successfully",
  "id": 1
}
```

---

## 📊 Task Data Model

Each task has 18 attributes:

### Required Fields
- `startDate` (DATE) - Task start date
- `endDate` (DATE) - Task end date
- `productType` (VARCHAR) - Product type (LPDDR5, LPDDR5X, DDR5, HBM3, GDDR6)
- `density` (VARCHAR) - Density (16Gb, 32Gb, 12Gb, 8Gb, 4Gb)
- `process` (VARCHAR) - Process (D1, D2, D3)
- `isMainProcess` (VARCHAR) - Main process flag (모제품, 자제품)
- `isNPI` (VARCHAR) - NPI flag (Yes, No)
- `organization` (VARCHAR) - Organization (x4, x8, x16)
- `stackMethod` (VARCHAR) - Stack method (TSV)
- `numberOfStack` (VARCHAR) - Number of stack (4H, 8H)
- `numberOfDie` (VARCHAR) - Number of die (SDP, 16DP)

### Optional Fields
- `praSchedule` (DATE) - PRA schedule date
- `packageSize` (DECIMAL) - Package size
- `packageHeight` (DECIMAL) - Package height
- `vdd1` (DECIMAL) - VDD1 voltage
- `vdd2` (DECIMAL) - VDD2 voltage
- `vddq` (DECIMAL) - VDDQ voltage
- `speed` (DECIMAL) - Speed specification

---

## 🗂️ Project Structure

```
FlexibleGantt/
├── .env                       # Environment variables
├── package.json               # Project dependencies
├── README.md                  # This file
├── SPEC_FEATURE.md            # Feature specification
├── SPEC_UI.md                 # UI specification
├── draft_req.txt              # Initial requirements
├── server/
│   ├── index.js               # Main server file
│   ├── db.js                  # PostgreSQL connection
│   ├── routes/
│   │   └── tasks.js           # Task API routes
│   └── sql/
│       ├── 01_create_database.sql
│       ├── 02_create_tasks_table.sql
│       └── 03_seed_tasks.sql
└── client/                    # Frontend (TBD)
```

---

## 📈 Initial Data

The database is pre-populated with **25 tasks** distributed as follows:

### By Product Type
- DDR5: 6 tasks
- DDR6: 6 tasks
- LPDDR5: 7 tasks
- LPDDR5X: 6 tasks

### By Density
- 16Gb: 5 tasks
- 32Gb: 5 tasks
- 12Gb: 5 tasks
- 8Gb: 5 tasks
- 4Gb: 5 tasks

### Timeline
- Date range: 2022-01-15 ~ 2026-01-31
- Distributed across 5 years (2022-2026)
- Quarterly distribution

---

## 🛠️ Development Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Test API endpoints
curl http://localhost:6001/api/tasks
curl http://localhost:6001/api/tasks/1
```

---

## 🗄️ Database Management

### Connect to PostgreSQL
```bash
psql -U postgres -d flexiblegantt
```

### Useful SQL Queries
```sql
-- Count all tasks
SELECT COUNT(*) FROM tasks;

-- Count by product type
SELECT product_type, COUNT(*)
FROM tasks
GROUP BY product_type
ORDER BY product_type;

-- Count by density
SELECT density, COUNT(*)
FROM tasks
GROUP BY density
ORDER BY density;

-- View all tasks with dates
SELECT id, product_type, density, start_date, end_date
FROM tasks
ORDER BY start_date;
```

---

## 📝 Configuration

### Gantt Initial Configuration

#### Timeline (X-axis)
- Start Year: 2022
- End Year: 2026
- Display: Quarters (Q1, Q2, Q3, Q4)

#### Structure (Y-axis)
- Group 1: "제품별 구조"
  - Depth 1: Product Type
  - Depth 2: Density

#### Attributes (Task Display)
- Selected: Product Type, Density, Process
- Shape: Gantt Bar
- Color: Light Gray (#D1D5DB)

---

## 🔧 Troubleshooting

### Server won't start
- Check if port 6001 is already in use
- Verify PostgreSQL is running
- Check .env configuration

### Database connection error
- Ensure PostgreSQL service is running
- Verify credentials in .env
- Check if database 'flexiblegantt' exists

### No data returned
- Verify tasks table has data: `SELECT COUNT(*) FROM tasks;`
- Run seed script if needed: `psql -U postgres -d flexiblegantt -f server/sql/03_seed_tasks.sql`

---

## 📚 Documentation

- **SPEC_FEATURE.md** - Complete feature specifications
- **SPEC_UI.md** - UI/UX design specifications
- **draft_req.txt** - Initial requirements

---

## ✅ Current Status

- ✅ PostgreSQL database created
- ✅ Tasks table with 18 attributes
- ✅ 25 initial tasks inserted
- ✅ REST API endpoints working
- ✅ Server running on port 6001
- ⏳ Frontend (React) - TBD

---

## 🚦 Next Steps

1. ✅ Backend API (Complete)
2. ⏳ Frontend React Application
3. ⏳ Gantt Chart Rendering
4. ⏳ Configuration Panel
5. ⏳ Search/Filter Functionality

---

**Version**: 1.0.0
**Port**: 6001
**Database**: PostgreSQL (flexiblegantt)
**Last Updated**: 2025-12-04
