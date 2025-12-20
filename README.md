# 🧪 Chemini - AI Chemistry Education Platform

<div align="center">

![Chemini Logo](public/logo.svg)

**An Interactive AI-Powered Chemistry Presentation & Learning Platform**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-black?style=for-the-badge&logo=three.js)](https://threejs.org)

</div>

---

## ✨ Features

### 🎬 Cinematic AI Presentation Mode
Experience an immersive, narrated presentation on **"Advances in Chemistry with AI"** featuring:
- **Synchronized Audio Narration** - 12+ minute professional voiceover
- **Dynamic 3D Visualizations** - Real-time molecular structures, neural networks, and protein simulations
- **Interactive Timeline** - Seek, pause, and resume at any point
- **Visual Triggers** - 30+ unique visualization types that sync with speech content

### 🤖 ChemDFM AI Chat Mode
Interact with an AI chemistry specialist powered by HuggingFace's inference API:
- **Expert Chemistry Knowledge** - From foundational to graduate-level chemistry
- **Real-time Responses** - Powered by Llama-3.1-8B-Instruct
- **Chemistry-focused System Prompt** - Ensures accurate, educational responses

### 🎨 Stunning Visualizations
- **3D Molecule Renderer** - Interactive molecular structures with Three.js
- **Neural Network Animations** - Dynamic neural network visualizations
- **Protein Structures** - AlphaFold-inspired protein visualizations
- **Chemical Reactions** - Animated synthesis pathways
- **Collision Simulations** - Temperature-controlled particle physics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- HuggingFace API key (for ChemDFM chat)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chemini.git
cd chemini

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

> ⚠️ **Important**: For Vercel deployment, add `VITE_HUGGINGFACE_API_KEY` in your project's Environment Variables dashboard.

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
chemini/
├── public/
│   ├── audio/           # Voiceover and theme music
│   └── logo.svg         # Application logo
├── src/
│   ├── components/
│   │   ├── ChatArea.jsx           # Main chat/presentation interface
│   │   ├── CinematicBackground.jsx # 3D visualization engine
│   │   ├── VisualComponents.jsx   # All visual components
│   │   ├── Sidebar.jsx            # Navigation & model selection
│   │   └── Citations.jsx          # Academic citations page
│   └── data/
│       └── presentationScript.js  # Timestamped presentation data
├── vercel.json          # Vercel deployment config with API rewrites
└── vite.config.js       # Vite configuration with proxy setup
```

---

## 🔧 Configuration

### API Proxy Setup

The app proxies HuggingFace API requests through Vercel rewrites to avoid CORS issues:

**vercel.json:**
```json
{
    "rewrites": [
        {
            "source": "/api/huggingface/:path*",
            "destination": "https://router.huggingface.co/:path*"
        }
    ]
}
```

### Local Development Proxy

**vite.config.js:**
```javascript
server: {
    proxy: {
        '/api/huggingface': {
            target: 'https://router.huggingface.co',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/huggingface/, ''),
        },
    },
}
```

---

## 📚 Academic Citations

This project is built upon peer-reviewed research:

| Paper | arXiv ID | Topic |
|-------|----------|-------|
| ChemDFM | 2401.14818 | Large Language Foundation Model for Chemistry |
| LLM-Augmented Synthesis | 2505.07027 | AI-Assisted Chemical Synthesis Planning |
| Atom-Anchored LLMs | 2510.16590 | Mass Conservation in AI Chemistry |
| IDPForge | 2502.11326 | Intrinsically Disordered Protein Modeling |

---

## 🎮 Usage Guide

### Presentation Mode (Chemini Advanced)
1. Select **"Chemini Advanced"** from the sidebar dropdown
2. Click the **Start** button on the loader screen
3. Follow the guided tour or skip to begin
4. Use the **Play/Pause** button to control playback
5. Drag the progress bar to seek to any timestamp

### Chat Mode (ChemDFM)
1. Select **"ChemDFM"** from the sidebar dropdown
2. Type your chemistry question in the input box
3. Press Enter or click Send to get AI responses

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Animations**: Anime.js, Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **AI Backend**: HuggingFace Inference API (Llama-3.1-8B-Instruct)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with 💜 for Chemistry Education**

*Bringing AI and Chemistry together to inspire the next generation of scientists*

</div>
