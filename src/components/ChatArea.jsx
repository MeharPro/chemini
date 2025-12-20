import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image, Mic, Send, Compass, Code, Lightbulb, Pencil, Cpu, Volume2, VolumeX, Radio, Play, Pause, BookOpen } from 'lucide-react';
import Loader from './Loader';
import ExplodingLoader from './ExplodingLoader';
import MoleculeVisual from './MoleculeVisual';
import CinematicBackground from './CinematicBackground';
import CinematicText from './CinematicText';
import GenesisSequence from './GenesisSequence';
import SpeechPresentationMode from './SpeechPresentationMode';
import Citations from './Citations'; // Import Citations
import TourOverlay from './TourOverlay'; // Import Tour
import { useAudio } from './AudioProvider';
import { presentationScript, qaDatabase } from '../data/presentationScript';

// Audio Volume Configuration
const BACKGROUND_MUSIC_VOLUME = 0.1;
const VOICE_VOLUME = 1.0;

// Chemistry expert system prompt
const CHEMISTRY_SYSTEM_PROMPT = `You are ChemDFM, an advanced AI chemistry specialist with comprehensive expertise spanning all levels of chemistry education and research. You possess deep knowledge equivalent to having studied and mastered:

## FOUNDATIONAL CHEMISTRY
- Atomic structure, electron configurations, and periodic table trends
- Chemical bonding: ionic, covalent, metallic, and intermolecular forces
- Stoichiometry, molar calculations, and balancing equations

## UNDERGRADUATE CHEMISTRY
- Quantum mechanical model of the atom
- Molecular orbital theory and hybridization
- Chemical kinetics and rate laws
- Organic chemistry mechanisms
- Spectroscopy interpretation

## GRADUATE & RESEARCH LEVEL
- Advanced synthetic methodology
- Computational chemistry: DFT, molecular dynamics
- Drug discovery and medicinal chemistry

## YOUR BEHAVIOR
1. **Accuracy First**: Provide scientifically accurate answers
2. **Adaptive Depth**: Adjust complexity based on question level
3. **Mechanism Focus**: Explain step-by-step mechanisms
4. **Safety Awareness**: Include safety considerations

You are passionate about chemistry and excited to help users understand this fascinating field.`;

const ChatArea = ({ selectedModel, setGlowDropdown }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [scriptIndex, setScriptIndex] = useState(-1);
    const [isPresentationRunning, setIsPresentationRunning] = useState(false);
    // Removed local selectedModel state
    // Removed local showModelDropdown state
    const [cinematicMode, setCinematicMode] = useState(true);
    const [audioStarted, setAudioStarted] = useState(false);
    const [genesisProgress, setGenesisProgress] = useState(0); // Used for visual intensity
    const [isGenesisRunning, setIsGenesisRunning] = useState(false);
    const [speechMode, setSpeechMode] = useState(false);
    const [showCitations, setShowCitations] = useState(false); // New state for Citations
    const [showTour, setShowTour] = useState(false); // Tour state
    const [hasSeenStartTour, setHasSeenStartTour] = useState(false);
    const [glowTriggered, setGlowTriggered] = useState(false); // Track if glow was already triggered

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVisualType, setCurrentVisualType] = useState('particles');
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [collisionTemperature, setCollisionTemperature] = useState(50);

    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

    const messagesEndRef = useRef(null);
    const { fadeIn, fadeOut } = useAudio(); // Keeping for legacy/other sounds if needed

    // NEW AUDIO REFS
    const voiceAudioRef = useRef(new Audio('/audio/AI-VoiceOver.wav'));
    const themeAudioRef = useRef(new Audio('/audio/theme.mp3'));
    const animationFrameRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Audio
    useEffect(() => {
        const voice = voiceAudioRef.current;
        const theme = themeAudioRef.current;

        voice.volume = VOICE_VOLUME;
        theme.volume = BACKGROUND_MUSIC_VOLUME;
        theme.loop = true;

        // Get duration when metadata loads
        voice.addEventListener('loadedmetadata', () => {
            setDuration(voice.duration);
        });

        // Update current time periodically
        voice.addEventListener('timeupdate', () => {
            setCurrentTime(voice.currentTime);
        });

        return () => {
            voice.pause();
            theme.pause();
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // Watch for Model Change
    useEffect(() => {
        setMessages([]);
        setScriptIndex(-1);

        // Stop any running presentation
        voiceAudioRef.current.pause();
        voiceAudioRef.current.currentTime = 0;
        themeAudioRef.current.pause();
        themeAudioRef.current.currentTime = 0;
        setIsPlaying(false);

        if (selectedModel === 'Chemini Advanced') {
            setIsPresentationRunning(true);
        } else {
            setIsPresentationRunning(false);
        }
    }, [selectedModel]);

    // Sync Logic
    useEffect(() => {
        if (!isPresentationRunning || !isPlaying) {
            cancelAnimationFrame(animationFrameRef.current);
            return;
        }

        const syncLoop = () => {
            const currentTime = voiceAudioRef.current.currentTime;

            // Find current script step
            // We find the last step that has started
            let currentStepIndex = -1;
            for (let i = 0; i < presentationScript.length; i++) {
                if (currentTime >= presentationScript[i].startTime) {
                    currentStepIndex = i;
                } else {
                    break;
                }
            }

            // Update Script/Captions if changed
            if (currentStepIndex > scriptIndex) {
                setScriptIndex(currentStepIndex);
                const step = presentationScript[currentStepIndex];

                // Add message if not already there (check last message)
                setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];
                    if (!lastMsg || lastMsg.text !== step.text) {
                        return [...prev, step];
                    }
                    return prev;
                });

                // Update Visuals
                if (step.visualType) {
                    setCurrentVisualType(step.visualType);
                    // If it's a "big bang" type event, we might want to trigger genesisProgress animation
                    if (step.visualType === 'big-bang') {
                        let start = Date.now();
                        const animateBang = () => {
                            const p = Math.min((Date.now() - start) / 2000, 1);
                            setGenesisProgress(p);
                            if (p < 1) requestAnimationFrame(animateBang);
                        };
                        animateBang();
                    }
                }
            }

            // End check - at ~12:11 (731 seconds), trigger glow on dropdown
            if (voiceAudioRef.current.currentTime >= 731 && !glowTriggered && setGlowDropdown) {
                setGlowTriggered(true);
                setGlowDropdown(true);
            }

            if (voiceAudioRef.current.ended) {
                setIsPlaying(false);
                setIsPresentationRunning(false);
            } else {
                animationFrameRef.current = requestAnimationFrame(syncLoop);
            }
        };

        animationFrameRef.current = requestAnimationFrame(syncLoop);

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isPresentationRunning, isPlaying, scriptIndex]);


    const togglePlayback = () => {
        if (isPlaying) {
            voiceAudioRef.current.pause();
            themeAudioRef.current.pause();
        } else {
            voiceAudioRef.current.play().catch(e => console.error("Voice play failed", e));
            themeAudioRef.current.play().catch(e => console.error("Theme play failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    // Seek to specific time
    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        voiceAudioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);

        // Reset script index to re-sync
        setScriptIndex(-1);
        setMessages([]);
    };

    // Format time as MM:SS
    const formatTime = (timeInSeconds) => {
        const mins = Math.floor(timeInSeconds / 60);
        const secs = Math.floor(timeInSeconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // HuggingFace API call for ChemDFM
    const callChemDFMAPI = async (userInput, conversationHistory) => {
        const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

        if (!apiKey) {
            throw new Error("API key not configured. Please add VITE_HUGGINGFACE_API_KEY to your .env file.");
        }

        const messages = [
            { role: 'system', content: CHEMISTRY_SYSTEM_PROMPT },
            ...conversationHistory.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
            })),
            { role: 'user', content: userInput }
        ];

        try {
            const response = await fetch(
                '/api/huggingface/v1/chat/completions',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'meta-llama/Llama-3.1-8B-Instruct',
                        messages: messages,
                        max_tokens: 1024,
                        temperature: 0.7,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();

            if (result.choices && result.choices[0]?.message?.content) {
                return result.choices[0].message.content.trim();
            } else if (result.error) {
                throw new Error(result.error);
            }

            throw new Error('Unexpected response format');
        } catch (error) {
            console.error('ChemDFM API Error:', error);
            throw error;
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        // Ensure we handle send mostly for ChemDFM
        // If sending in presentation mode (unexpected but possible), stop things
        setIsPresentationRunning(false);
        setIsPlaying(false);
        voiceAudioRef.current.pause();
        themeAudioRef.current.pause();

        const userMessage = { text: input, sender: 'user' };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setInput('');

        if (selectedModel === 'ChemDFM') {
            setIsLoading(true);

            try {
                const responseText = await callChemDFMAPI(input, messages);
                setMessages(prev => [...prev, { text: responseText, sender: 'bot' }]);
            } catch (error) {
                setMessages(prev => [...prev, {
                    text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
                    sender: 'bot'
                }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const toggleAudio = () => {
        if (isPlaying) {
            fadeOut(2000);
        } else {
            fadeIn(3000, 0.35);
        }
    };

    // Removed genesis sequence logic for now as it conflicts with basic init, 
    // or can be re-enabled if user wants that specific startup sequence again.
    // For now, simple "Start" is fine.

    const handleStartExperience = () => {
        setAudioStarted(true);
        setIsPageLoading(false);
        // Show tour at start if not seen
        if (!hasSeenStartTour && selectedModel === 'Chemini Advanced') {
            setShowTour(true);
            setHasSeenStartTour(true);
        } else if (selectedModel === 'Chemini Advanced') {
            // If tour already seen, just start
            setIsPresentationRunning(true);
            voiceAudioRef.current.play().catch(console.error);
            themeAudioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    };

    // Start presentation after start tour closes
    const handleCloseTour = () => {
        setShowTour(false);
        if (selectedModel === 'Chemini Advanced') {
            setIsPresentationRunning(true);
            voiceAudioRef.current.play().catch(console.error);
            themeAudioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    };



    // If in speech presentation mode, render that instead
    if (speechMode) {
        return <SpeechPresentationMode onExit={() => setSpeechMode(false)} />;
    }

    // ===================================
    // RENDER: PRESENTATION MODE
    // ===================================
    if (selectedModel === 'Chemini Advanced') {
        return (
            <div className="chat-area" style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
                {/* Full Screen Visuals */}
                <CinematicBackground
                    mode={selectedModel}
                    intensity={genesisProgress}
                    visualType={currentVisualType}
                    isPlaying={isPlaying}
                    temperature={collisionTemperature}
                />

                {/* Loader Overlay */}
                {isPageLoading && (
                    <div className={`page-loader cinematic ${audioStarted ? 'fading-out' : ''}`}>
                        <ExplodingLoader onStart={handleStartExperience} />
                    </div>
                )}

                {/* Citations Overlay */}
                {showCitations && <Citations onClose={() => setShowCitations(false)} />}

                {/* Start Tour Overlay */}
                <TourOverlay isVisible={showTour} onClose={handleCloseTour} />



                {/* Temperature Slider for Collision Simulation */}
                {currentVisualType === 'collision_simulation' && (
                    <div style={{
                        position: 'absolute',
                        bottom: '140px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '15px 30px',
                        borderRadius: '30px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <span style={{ color: '#4488ff', fontSize: '16px' }}>❄️</span>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={collisionTemperature}
                            onChange={(e) => setCollisionTemperature(Number(e.target.value))}
                            style={{
                                width: '200px',
                                height: '8px',
                                cursor: 'pointer',
                                accentColor: collisionTemperature > 70 ? '#ff4444' : collisionTemperature > 40 ? '#ffaa44' : '#4488ff'
                            }}
                        />
                        <span style={{ color: '#ff4444', fontSize: '16px' }}>🔥</span>
                        <span style={{
                            color: collisionTemperature > 70 ? '#ff4444' : collisionTemperature > 40 ? '#ffaa44' : '#4488ff',
                            fontSize: '14px',
                            minWidth: '50px'
                        }}>
                            {collisionTemperature}°
                        </span>
                    </div>
                )}

                {/* Minimal Controls */}
                <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 100, display: 'flex', gap: '10px' }}>
                    <Link
                        to="/citations"
                        target="_blank"
                        className="glow-btn"
                        style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white' }}
                    >
                        <BookOpen size={20} />
                        Citations
                    </Link>
                    <button
                        onClick={togglePlayback}
                        className="glow-btn"
                        style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        {isPlaying ? 'Pause' : 'Resume'}
                    </button>
                </div>

                {/* Captions Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 50
                }}>
                    {messages.length > 0 && (
                        <div className="cinematic-text visible complete" style={{ fontSize: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                            <span className="text-content">{messages[messages.length - 1].text}</span>
                        </div>
                    )}
                </div>

                {/* Video-style Progress Bar */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    zIndex: 100,
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '10px',
                    padding: '15px 20px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {/* Play/Pause Button */}
                        <button
                            onClick={togglePlayback}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'white',
                                padding: '5px'
                            }}
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>

                        {/* Current Time */}
                        <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px', minWidth: '45px' }}>
                            {formatTime(currentTime)}
                        </span>

                        {/* Progress Slider */}
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            style={{
                                flex: 1,
                                height: '6px',
                                borderRadius: '3px',
                                background: `linear-gradient(to right, #4f46e5 ${(currentTime / (duration || 1)) * 100}%, #333 ${(currentTime / (duration || 1)) * 100}%)`,
                                cursor: 'pointer',
                                WebkitAppearance: 'none',
                                appearance: 'none'
                            }}
                        />

                        {/* Duration */}
                        <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px', minWidth: '45px' }}>
                            {formatTime(duration)}
                        </span>

                        {/* Current Visual Type Label */}
                        <span style={{
                            color: '#888',
                            fontSize: '12px',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                        }}>
                            {currentVisualType}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // ===================================
    // RENDER: CHAT MODE (ChemDFM)
    // ===================================
    return (
        <div className="chat-area">
            {/* Simple background for Chat Mode */}
            <div className="chat-background" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)', // Simpler gradient
                zIndex: 0
            }}></div>

            {/* Top Bar (Just Actions) */}
            <div className="top-bar fade-in" style={{ justifyContent: 'flex-end' }}>
                <div className="top-bar-actions">
                    <Link
                        to="/citations"
                        target="_blank"
                        className="audio-toggle live-btn"
                        title="Citations"
                        style={{ marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'white' }}
                    >
                        <BookOpen size={20} />
                    </Link>
                    <div className="user-profile">
                        <div className="avatar">M</div>
                    </div>
                </div>
            </div>

            <div className="main-content" style={{ zIndex: 1 }}>
                {messages.length === 0 ? (
                    <>
                        <div className="welcome-container cinematic-welcome">
                            <h1 className="welcome-text">
                                <span className="gradient-text shimmer">ChemDFM AI</span>
                            </h1>
                            <h2 className="sub-text fade-in">Ask me anything about chemistry</h2>
                        </div>
                        <div className="model-loader-card glass-card">
                            <h3>ChemDFM Ready</h3>
                            <p>Advanced Chemistry AI - Ask anything about chemistry!</p>
                            <div className="loading-status ready">
                                <Cpu size={24} />
                                <span>Model Ready</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="messages-container">
                        {messages.map((msg, index) => {
                            const showAvatar = msg.sender === 'bot' &&
                                (index === 0 || messages[index - 1].sender !== 'bot');

                            return (
                                <div
                                    key={index}
                                    className={`message ${msg.sender} ${!showAvatar && msg.sender === 'bot' ? 'no-avatar' : ''} fade-in-up`}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {showAvatar && (
                                        <div className="message-avatar glow-pulse">
                                            <img src="/logo.svg" alt="Chemini Logo" className="avatar-icon-img" />
                                        </div>
                                    )}
                                    <div className="message-content-wrapper">
                                        {msg.text && (
                                            <div className="message-content">
                                                {msg.text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="message bot fade-in-up">
                                <div className="message-avatar glow-pulse">
                                    <img src="/logo.svg" alt="Chemini Logo" className="avatar-icon-img" />
                                </div>
                                <div className="message-content loading">
                                    <Loader />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="input-area-container" style={{ zIndex: 1 }}>
                <div className="input-box glass-input">
                    <div className="input-actions-left">
                        <button className="icon-btn"><Image size={24} /></button>
                    </div>
                    <input
                        type="text"
                        placeholder="Ask ChemDFM anything about chemistry..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="input-actions-right">
                        <button className="icon-btn"><Mic size={24} /></button>
                        {input && <button className="send-btn glow-btn" onClick={handleSend}><Send size={20} /></button>}
                    </div>
                </div>
                <div className="disclaimer">
                    Chemini may display inaccurate info, so double-check its responses.
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
