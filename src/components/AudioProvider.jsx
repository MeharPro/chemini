import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const fadeIntervalRef = useRef(null);

    useEffect(() => {
        const audio = new Audio('/theme.mp3');
        audio.loop = true;
        audio.volume = 0;
        audio.preload = 'auto';
        audio.muted = true; // Start muted to allow "autoplay"
        audioRef.current = audio;

        audio.addEventListener('canplaythrough', () => {
            setIsReady(true);
            // Try to play muted immediately
            audio.play().catch(() => { });
        });

        audio.load();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
            }
        };
    }, []);

    const fadeIn = (duration = 8000, targetVolume = 0.4) => {
        if (!audioRef.current || isPlaying) return;

        // Unmute and ensure playing
        audioRef.current.muted = false;
        audioRef.current.volume = 0;

        const playPromise = audioRef.current.play();
        if (playPromise) {
            playPromise.then(() => {
                setIsPlaying(true);

                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

                const steps = 100;
                const stepTime = duration / steps;
                const volumeStep = targetVolume / steps;
                let currentStep = 0;

                fadeIntervalRef.current = setInterval(() => {
                    currentStep++;
                    const newVolume = Math.min(volumeStep * currentStep, targetVolume);
                    if (audioRef.current) audioRef.current.volume = newVolume;
                    setVolume(newVolume);
                    if (currentStep >= steps) clearInterval(fadeIntervalRef.current);
                }, stepTime);
            }).catch(console.error);
        }
    };

    const fadeOut = (duration = 3000) => {
        if (!audioRef.current || !isPlaying) return;

        const currentVol = audioRef.current.volume;
        const steps = 60;
        const stepTime = duration / steps;
        let currentStep = 0;

        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

        fadeIntervalRef.current = setInterval(() => {
            currentStep++;
            const newVolume = Math.max(currentVol * (1 - currentStep / steps), 0);
            if (audioRef.current) audioRef.current.volume = newVolume;
            setVolume(newVolume);

            if (currentStep >= steps) {
                clearInterval(fadeIntervalRef.current);
                if (audioRef.current) audioRef.current.pause();
                setIsPlaying(false);
            }
        }, stepTime);
    };

    return (
        <AudioContext.Provider value={{ fadeIn, fadeOut, isPlaying, volume, isReady }}>
            {children}
        </AudioContext.Provider>
    );
};

export default AudioProvider;
