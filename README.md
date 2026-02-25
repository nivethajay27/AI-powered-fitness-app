# AI-Powered Fitness Performance App

A full-stack fitness tracking and AI analytics web application that allows users to log workouts and generate adaptive training insights using AI.

This project demonstrates **AI + Full Stack Development** using React, Node.js, PostgreSQL, and the Grok API.

---

## Features

- Add workout data (mileage, heart rate, sleep, soreness)
- Delete workouts
- Dashboard view of training logs
- AI-generated:
  - Recovery score
  - 5-day adaptive workout plan
- Fast and lightweight AI inference using structured JSON outputs

---

## Tech Stack

**Frontend**
- React
- Basic CSS
- Fetch API (no Axios)

**Backend**
- Node.js
- Express

**Database**
- PostgreSQL

**AI**
- Groq LLM API (OpenAI-compatible endpoint)

---

## Setup Instructions

### 1. Clone the repo
git clone https://github.com/yourusername/ai-powered-fitness-app.git
cd ai-powered-fitness-app

---

### 2. Backend Setup
cd server
npm install

Create `.env` file:
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/fitness_db
GROQ_API_KEY=your_api_key

Run server:
node index.js

---

### 3. Database Setup

Create database:
CREATE DATABASE fitness_db;

Create table:
CREATE TABLE workouts (
id SERIAL PRIMARY KEY,
date DATE DEFAULT CURRENT_DATE,
mileage FLOAT,
avg_hr INT,
sleep FLOAT,
soreness INT
);

---

### 4. Frontend Setup
cd client
npm install
npm start

App runs at:
http://localhost:3000
