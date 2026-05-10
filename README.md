# Mandi Agri-Tech 🌾

A modern, AI-powered dashboard for tracking Indian Agriculture Market (Mandi) prices in real-time. This application provides farmers, traders, and consumers with data-driven insights, beautiful visualizations, and an intelligent multilingual AI assistant.

## ✨ Features

- **Real-time Price Tracking**: Fetches the latest commodity prices from government APIs.
- **AI Assistant ("Kisan Sahayak")**: 
  - Powered by **Groq (Llama 3.3)** or **Gemini 1.5**.
  - Context-aware: Answers questions based on the specific market data currently on your screen.
  - Multilingual: Supports English, Hindi, and Telugu.
- **Voice-to-Voice Interaction**:
  - Hands-free searching and querying.
  - Bot reads responses aloud using Text-to-Speech (TTS).
- **Interactive Dashboards**:
  - Comparative charts using Recharts.
  - State and District level filtering.
  - High/Low price highlights and trend analysis.
- **Robust API Handling**: Built-in request queuing and rate-limiting (429) protection.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS
- **State Management**: React Hooks (Custom hooks for data and search)
- **AI**: Groq API / Google Gemini API
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios with custom request queuing

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- An API key from [data.gov.in](https://data.gov.in/)
- An AI API key (either [Groq](https://console.groq.com/) or [Google AI Studio](https://aistudio.google.com/))

### 2. Clone and Install
```bash
git clone <repository-url>
cd agri-tech
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
VITE_API_BASE=/api/resource/9ef84268-d588-465a-a308-a864a43d0070
VITE_API_KEY=your_mandi_api_key_here

# AI Configuration (The app prefers Groq if both are provided)
VITE_XAI_API_KEY=your_groq_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

## 🎙️ Using the Assistant
- Open the chatbot in the bottom-right corner.
- Click the **Microphone** icon in the header to start voice input.
- Speak in English, Hindi, or Telugu.
- The bot will process your request and **speak its response** back to you.

## 🛡️ API Safety
The application includes a centralized `apiClient.js` that manages a global request queue. This ensures that the app never exceeds the rate limits of public APIs, automatically handling 429 errors with exponential backoff and request throttling.

## 📄 License
MIT
