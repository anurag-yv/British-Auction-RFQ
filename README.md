# **British Auction RFQ System**

## 📝 Project Overview
The **British Auction RFQ System** is a web-based platform for managing auctions in a **British auction format**. Suppliers can place bids on RFQs (Request For Quotes) in real-time, while the system automatically monitors auction activity, extends auctions based on configurable triggers, and maintains a detailed activity log.

This platform is ideal for organizations that want a dynamic and transparent auction system with automated controls.

---

## 🚀 Key Features

### **Admin Capabilities**
- Create RFQs with start, close, and forced close times.  
- Configure trigger window and extension duration for automatic auction extensions.

### **Supplier Capabilities**
- View all RFQs and the current lowest bid.  
- Place bids in real-time.

### **Auction Logic**
- Automatic extension if:  
   a) Any bid in last X minutes
   b) Any Supplier Rank Change in last X minutes
   c) Only Lowest Bidder (L1) Rank Change in last X minutes 
- Real-time activity log for bid submissions and auction extensions.  
- Dynamic auction status: `Active`, `Closed`, `Force Closed`, `Not Started`.

---

## 📂 Folder Structure

```
British-Auction-RFQ/
├── backend/                 # Node.js + Express backend
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   └── controllers/
└── frontend/                # React frontend
    ├── package.json
    ├── public/
    └── src/
        ├── App.js
        ├── pages/
        └── components/
```

---

## 🔧 Backend

**Tech Stack:** Node.js, Express.js, MongoDB  

**Features:**
- Create RFQs with start, close, forced close times, trigger window, and extension duration.  
- Place bids with validation rules.  
- Automatically extend auctions based on triggers.  
- Track activity logs for all events.  

**Run Backend:**
```bash
cd backend
npm install
node server.js
```

**API Base URL:** `http://localhost:5000/api`

**Key API Endpoints:**

| Endpoint            | Method | Description                    |
|--------------------|--------|--------------------------------|
| /api/rfq           | POST   | Create a new RFQ               |
| /api/rfqs          | GET    | Get all RFQs                   |
| /api/rfq/:id       | GET    | Get RFQ details                |
| /api/bid           | POST   | Place a new bid                |
| /api/bids/:rfqId   | GET    | Get all bids for an RFQ        |
| /api/logs/:rfqId   | GET    | Get activity logs for an RFQ   |

---

## 🌐 Frontend

**Tech Stack:** React.js, Tailwind CSS / Inline styles  

**Features:**
- List all RFQs with details:
  - RFQ Name / ID  
  - Current Lowest Bid  
  - Current Bid Close Time  
  - Forced Close Time  
  - Auction Status  
- View auction details:
  - Real-time bid list  
  - Timer until auction closes  
  - Activity log for bid submissions and extensions  
- Create RFQs (Admin)  
- Place bids (Suppliers)  

**Run Frontend:**
```bash
cd frontend
npm install
npm start
```
- Opens at `http://localhost:3000`

---

## 🗄️ Database Schema

### **RFQs Collection**
| Field             | Type   | Description                               |
|------------------|--------|-------------------------------------------|
| _id              | String | Unique RFQ ID                             |
| name             | String | RFQ Name                                  |
| startTime        | Date   | Auction start time                         |
| closeTime        | Date   | Scheduled auction close time               |
| forcedCloseTime  | Date   | Absolute auction close time                |
| triggerWindow    | Number | Minutes before close to monitor activity  |
| extensionDuration| Number | Minutes to extend auction                  |
| status           | String | Active / Closed / Force Closed / Not Started |
| lowestBid        | Number | Current lowest bid                         |

### **Bids Collection**
| Field     | Type   | Description        |
|-----------|--------|------------------|
| _id       | String | Unique bid ID     |
| rfqId     | String | Linked RFQ ID    |
| supplier  | String | Supplier name     |
| price     | Number | Bid amount        |
| createdAt | Date   | Timestamp of bid  |

### **Activity Logs Collection**
| Field        | Type   | Description                                |
|--------------|--------|-------------------------------------------|
| _id          | String | Unique log ID                              |
| rfqId        | String | Linked RFQ ID                              |
| type         | String | bid / extension                            |
| message      | String | Description of event                        |
| reason       | String | Reason for extension (if applicable)       |
| oldCloseTime | Date   | Previous close time (if extension)         |
| newCloseTime | Date   | New close time (if extension)              |
| createdAt    | Date   | Timestamp of log                            |

---

## 🏗️ Architecture Overview

```
Frontend (React)  →  REST API Calls  →  Backend (Node.js + Express)  →  MongoDB
```

- Backend handles **auction logic, validation, and automatic extensions**.  
- Frontend polls backend for **real-time updates**.  
- Activity logs capture **every bid and auction extension**.

---

## ⚡ How to Use

1. Start MongoDB (locally or via Atlas).  
2. Start backend:
```bash
cd backend
node server.js
```
3. Start frontend:
```bash
cd frontend
npm start
```
4. Open browser at `http://localhost:3000`.  

**Workflow:** Create RFQ → Suppliers view → Place bids → Monitor status & activity logs.
