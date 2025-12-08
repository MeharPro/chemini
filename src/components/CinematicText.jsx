import React, { useState, useEffect } from 'react';
import './CinematicText.css';

const CinematicText = ({ text, delay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Initial delay before starting
        const startTimer = setTimeout(() => {
            setIsVisible(true);

            // Character-by-character reveal
            let charIndex = 0;
            const revealSpeed = 15; // ms per character

            const revealInterval = setInterval(() => {
                if (charIndex < text.length) {
                    setDisplayedText(text.slice(0, charIndex + 1));
                    charIndex++;
                } else {
                    clearInterval(revealInterval);
                    setIsComplete(true);
                    if (onComplete) onComplete();
                }
            }, revealSpeed);

            return () => clearInterval(revealInterval);
        }, delay);

        return () => clearTimeout(startTimer);
    }, [text, delay, onComplete]);

    return (
        <div className={`cinematic-text ${isVisible ? 'visible' : ''} ${isComplete ? 'complete' : ''}`}>
            <span className="text-content">{displayedText}</span>
            {!isComplete && <span className="cursor">|</span>}
        </div>
    );
};

export default CinematicText;
