import React, { useState, useEffect, useRef } from 'react';
import './ExplodingLoader.css';

const ExplodingLoader = ({ onStart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState([]);
    const containerRef = useRef(null);

    const handleClick = () => {
        if (onStart) onStart();
    };

    return (
        <div className="loader-landing" ref={containerRef}>
            {/* Central widget */}
            <div
                className={`central-widget ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                {/* Outer rings */}
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>

                {/* Orbital particles */}
                <div className="orbital-track">
                    <div className="orbital-particle p1"></div>
                    <div className="orbital-particle p2"></div>
                    <div className="orbital-particle p3"></div>
                </div>

                {/* Logo container with glow */}
                <div className="logo-container">
                    <div className="logo-glow"></div>
                    <img src="/logo.svg" alt="Chemini" className="main-logo" />
                </div>

                {/* Click prompt */}
                <div className="click-prompt">
                    <span className="prompt-text">Click to Begin</span>
                    <div className="prompt-underline"></div>
                </div>
            </div>

            {/* Title */}
            <h1 className="landing-title">
                <span className="title-gradient">CHEMINI</span>
            </h1>
            <p className="landing-subtitle">AI-Powered Chemistry Discovery</p>
        </div>
    );
};

export default ExplodingLoader;
