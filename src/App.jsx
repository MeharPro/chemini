import React from 'react';
import { AudioProvider } from './components/AudioProvider';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './App.css';

function App() {
  return (
    <AudioProvider>
      <div className="app-container">
        <Sidebar />
        <ChatArea />
      </div>
    </AudioProvider>
  );
}

export default App;
