# Spendly

Spendly is a powerful financial management platform designed to help users track their investments, manage transactions, and receive personalized financial insights through AI-driven chatbots. Whether you invest in stocks, mutual funds, or cryptocurrencies, Spendly provides an intuitive, data-driven experience to optimize your financial decisions.

## 🔄 Workflow

1. **User Signup & Authentication:**
   - The user signs up using a one-time OTP verification for secure authentication.
   
2. **Bank Statement Upload & Processing:**
   - The user uploads their latest bank transaction slip (PDF format). If encrypted, they also provide the password.
   - The system decrypts and parses the PDF to extract transaction details.
   - Extracted transactions are stored in the database for analysis.

3. **Budget Initialization & Management:**
   - An initial budget is assigned to the user based on the extracted balance.
   - Users can interact with an **Agentic AI chatbot** to update their budget dynamically based on financial goals and spending habits.
   - Budget adjustments are made automatically based on user demands and transaction trends.

4. **Investment & Market Insights:**
   - Users receive AI-driven recommendations for **stocks**, **mutual funds**, and **cryptocurrencies**.
   - Real-time price tracking for investments is handled by a **Python microservice** running on Render.
   - The microservice scrapes and transforms stock and mutual fund data for seamless user experience.
   - Cryptocurrency prices are updated every 10 minutes.

5. **Financial Planning & Goal Management:**
   - The platform includes an **FD calculator** to help users plan for fixed deposits.
   - A **Goals Manager** assists users in setting and tracking financial goals.
   - **Graphical representation** of financial trends is generated using bank statements for better insights.

## 🚀 Features

### 🔒 Secure User Authentication
- Email verification and OTP-based login to ensure robust security.

### 📈 Investment Insights
- **Stocks:** Real-time stock recommendations and AI-powered market analysis.
- **Mutual Funds:** Personalized mutual fund suggestions based on your investment preferences.
- **Cryptocurrency:** Live tracking of cryptocurrency prices, trends, and market movements.

### 💳 Transactions Management
- View, categorize, and analyze transaction history.
- Detailed breakdowns for credits and debits.
- Expense tracking for better financial planning.

### 🤖 AI Financial Assistant
- AI-powered chatbot for real-time financial guidance.
- Supports speech recognition for hands-free interaction.

## 🛠️ Microservices & AI Integration
- **Microservices Architecture** ensures modular and scalable backend services.
- **Agentic AI** powers dynamic budgeting and financial recommendations.
- **Python Microservice** scrapes and processes real-time stock, mutual fund, and cryptocurrency data.

## 🛠️ Tech Stack

### Frontend
- **Next.js** – Server-side rendering & optimized performance.
- **React.js** – Modular and reusable UI components.
- **TypeScript** – Statically typed language for improved reliability.
- **Tailwind CSS** – Utility-first styling for rapid UI development.

### Backend
- **Node.js** – Scalable server-side execution.
- **Express.js** – Lightweight web framework for API handling.
- **MongoDB** – NoSQL database for efficient data storage.

### Authentication & Security
- **next-auth** – Secure user authentication with session management.
- **Nodemailer** – Email verification and notifications.

### APIs & Integrations
- Real-time stock & crypto market data via external financial APIs.
- AI-driven recommendations using ML-based predictive analytics.

## 🚀 Deployment

- **Main Webapp:** Vercel
- **Microservices:** Render
- **Database:** MongoDB Atlas

---
🚀 *Manage your finances smarter with Spendly!*