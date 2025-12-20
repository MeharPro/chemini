import React from 'react';
import { X } from 'lucide-react';
import './SpeechPresentationMode.css';

const SpeechPresentationMode = ({ onExit }) => {
    return (
        <div className="speech-presentation-container">
            <button className="exit-btn" onClick={onExit}>
                <X size={24} />
            </button>
            <div className="content">
                <h1>Live Presentation Mode</h1>
                <p>Voice-activated visuals coming soon.</p>
            </div>
        </div>
    );
};

export default SpeechPresentationMode;
