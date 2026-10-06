# SafeText AI 🛡️

SafeText AI is an AI-powered scam detection and digital safety platform designed to help users identify suspicious messages, scam patterns, risky URLs, and potential fraud attempts.

It analyzes messages and other scam-related inputs, calculates a risk score, identifies the threat category, and provides an understandable explanation of why the content may be dangerous.

The platform also provides scan history, scam reporting, heat maps, trends, screenshot scanning, voice scam analysis, and secure user authentication. 

---

## 🚀 Features

### 🤖 Scam Message Scanner

* AI-powered scam message analysis
* Scam and suspicious message detection
* Scam pattern identification
* Risk score calculation
* Threat category detection
* Explainable analysis

### 🔗 URL & Link Analysis

* Detects suspicious URLs inside messages
* Identifies potentially risky links
* Helps users understand possible URL-based threats

### 📸 Screenshot Scam Scanner

* Upload suspicious screenshots
* Extract text using OCR
* Analyze extracted content for scam indicators
* Generate risk score and explanation

### 🎙️ Voice Scam Analyzer

* Upload suspicious audio
* Convert speech into text
* Analyze the transcribed content for scam indicators
* Provide scam risk analysis

### 📊 Scam Intelligence Dashboard

* Scan statistics
* Scam trends
* Scam heat map
* Category-based insights
* Overall scam activity overview

### 🕘 Scan History

* Automatically saves user scans
* User-specific scan history
* Search and filtering
* View previous scan results
* Secure history isolation between users

### ⚠️ Scam Reporting

* Report suspicious scam messages
* Store reports securely
* Help build scam intelligence data

### 🔐 Authentication & Security

* Supabase authentication
* Secure user sessions
* User-specific data
* Row Level Security (RLS)
* Protected database access
* Input validation and error handling

### 👴 Senior Citizen Mode

* Simplified safety-focused interface
* Easier-to-understand scam warnings
* Designed to make scam detection more accessible

### 🌗 Modern UI

* Light and Dark mode
* Responsive interface
* Loading states
* Error handling
* User-friendly dashboard

---

## 🔄 How It Works

1. User opens SafeText AI.
2. User logs in securely.
3. User enters a suspicious message or uploads suspicious content.
4. SafeText AI analyzes the content.
5. Scam indicators and suspicious URLs are identified.
6. A risk score and threat category are generated.
7. The system explains why the content may be dangerous.
8. The result can be saved to the user's scan history.
9. Users can report suspicious content.
10. Scam data can be viewed through dashboard insights such as trends and heat maps.

---

## 🛠️ Technologies

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Python
* FastAPI
* AI-powered analysis
* OCR
* Speech-to-text processing
* URL analysis

### Database & Authentication

* Supabase
* Supabase Authentication
* PostgreSQL
* Row Level Security (RLS)

### Deployment

* Vercel — Frontend
* Render — Backend
* Supabase — Database & Authentication

---

## 📁 Project Structure

```text
safetext-ai/
│
├── app/                 → Frontend pages and UI
├── backend/             → FastAPI backend and AI analysis
├── public/              → Static assets
├── lib/                 → Supabase and application utilities
├── package.json         → Frontend dependencies and scripts
├── next.config.ts       → Next.js configuration
└── README.md            → Project documentation
```

---

## ▶️ Run Locally

Install the required dependencies and configure the required environment variables.

Then start the frontend and backend together:

```bash
npm run dev:all
```

The application can then be accessed locally through the development server.

---

## 🌐 Live Project

**SafeText AI is deployed and available online.**

🔗 https://safetextai.vercel.app

---

## ☁️ Deployment Architecture

```text
                    ┌──────────────────┐
                    │    SafeText AI   │
                    │     Frontend     │
                    │     Next.js      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      Vercel      │
                    │    Deployment    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     FastAPI      │
                    │     Backend      │
                    │     Render       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Supabase     │
                    │ Auth + Database  │
                    │       + RLS      │
                    └──────────────────┘
```

---

## 🔐 Security

SafeText AI uses security controls to protect user data:

* Supabase Authentication
* User-specific database records
* Row Level Security (RLS)
* Protected scan history
* Protected scam reports
* Input validation
* Secure environment variables
* Production CORS configuration

---

## 🎯 Project Goal

The goal of SafeText AI is to provide a simple and accessible platform that helps users recognize online scams before they become victims.

By combining AI analysis, URL detection, OCR, voice analysis, scam reporting, and security-focused dashboards, SafeText AI provides users with multiple ways to identify and understand potential digital threats.

---

## 🏆 Project Status

**SafeText AI — Complete and Deployed 🚀**

* ✅ Phase 1 — Core Scam Detection
* ✅ Phase 2 — Advanced Scam Detection Features
* ✅ Phase 3 — Database, History & Security
* ✅ Phase 4 — Production Deployment
* ✅ Frontend deployed on Vercel
* ✅ Backend deployed on Render
* ✅ Supabase Authentication & Database
* ✅ Production testing completed

**Status: COMPLETE ✅**

```

### 🛡️ SafeText AI
**Detect scams. Understand threats. Stay safe online.**

```
