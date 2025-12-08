import React, { useState, useEffect } from 'react';
import './GenesisSequence.css';

const GenesisSequence = ({ onComplete }) => {
    const [textIndex, setTextIndex] = useState(0);
    const [showText, setShowText] = useState(false);

    const sequence = [
        "SOMEONE ASKED ME ONCE",
        "IS THIS ALL I HAVE?",
        "AND I SAID NO",
        "LET THERE BE LIGHT"
    ];

    useEffect(() => {
        let currentIndex = 0;

        const runSequence = async () => {
            for (let i = 0; i < sequence.length; i++) {
                setTextIndex(i);
                setShowText(true);

                // Show text for 2 seconds
                await new Promise(r => setTimeout(r, 2000));

                setShowText(false);

                // Brief pause between texts (except after last one)
                if (i < sequence.length - 1) {
                    await new Promise(r => setTimeout(r, 500));
                }
            }

            // Final pause before explosion
            await new Promise(r => setTimeout(r, 500));
            onComplete();
        };

        runSequence();
    }, []);

    return (
        <div className="genesis-container">
            <h1 className={`genesis-text ${showText ? 'visible' : ''} ${textIndex === 3 ? 'final' : ''}`}>
                {sequence[textIndex]}
            </h1>
        </div>
    );
};

export default GenesisSequence;
