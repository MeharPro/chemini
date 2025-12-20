import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AudioProvider } from './components/AudioProvider';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Citations from './components/Citations';
import './App.css';

// Layout component to include Sidebar only on main routes
const MainLayout = ({ selectedModel, setSelectedModel, glowDropdown, setGlowDropdown }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        glowDropdown={glowDropdown}
        setGlowDropdown={setGlowDropdown}
      />
      <ChatArea selectedModel={selectedModel} setGlowDropdown={setGlowDropdown} />
    </div>
  );
};

function App() {
  const [selectedModel, setSelectedModel] = React.useState('Chemini Advanced');
  const [glowDropdown, setGlowDropdown] = React.useState(false);

  return (
    <AudioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout selectedModel={selectedModel} setSelectedModel={setSelectedModel} glowDropdown={glowDropdown} setGlowDropdown={setGlowDropdown} />} />
          <Route path="/citations" element={<Citations standalone={true} />} />
        </Routes>
      </BrowserRouter>
    </AudioProvider>
  );
}

export default App;

