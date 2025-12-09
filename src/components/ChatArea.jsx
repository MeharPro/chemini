import React, { useState, useRef, useEffect } from 'react';
import { Image, Mic, Send, Compass, Code, Lightbulb, Pencil, Cpu, Volume2, VolumeX } from 'lucide-react';
import Loader from './Loader';
import ExplodingLoader from './ExplodingLoader';
import MoleculeVisual from './MoleculeVisual';
import CinematicBackground from './CinematicBackground';
import CinematicText from './CinematicText';
import GenesisSequence from './GenesisSequence';
import { useAudio } from './AudioProvider';
import { presentationScript, qaDatabase } from '../data/presentationScript';

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

const ChatArea = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [scriptIndex, setScriptIndex] = useState(0);
    const [isPresentationRunning, setIsPresentationRunning] = useState(false);
    const [selectedModel, setSelectedModel] = useState('Chemini Advanced');
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [cinematicMode, setCinematicMode] = useState(true);
    const [audioStarted, setAudioStarted] = useState(false);
    const [genesisProgress, setGenesisProgress] = useState(0);
    const [isGenesisRunning, setIsGenesisRunning] = useState(false);

    const messagesEndRef = useRef(null);
    const { fadeIn, fadeOut, isPlaying } = useAudio();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Presentation auto-run
    useEffect(() => {
        if (!isPresentationRunning || scriptIndex >= presentationScript.length || selectedModel !== 'Chemini Advanced') return;

        const step = presentationScript[scriptIndex];
        const delay = step.delay || 2000;

        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
            setMessages(prev => [...prev, step]);
            setScriptIndex(prev => prev + 1);
        }, delay);

        return () => clearTimeout(timer);
    }, [isPresentationRunning, scriptIndex, selectedModel]);

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

        setIsPresentationRunning(false);

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
        } else {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);

                let responseText = qaDatabase.default;
                const lowerInput = input.toLowerCase();
                for (const key in qaDatabase) {
                    if (lowerInput.includes(key)) {
                        responseText = qaDatabase[key];
                        break;
                    }
                }

                setMessages(prev => [...prev, { text: responseText, sender: 'bot' }]);
            }, 1500);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const toggleModel = (model) => {
        setSelectedModel(model);
        setShowModelDropdown(false);
        setMessages([]);
        setScriptIndex(0);

        if (model === 'Chemini Advanced') {
            setIsPresentationRunning(true);
        } else {
            setIsPresentationRunning(false);
        }
    };

    const toggleAudio = () => {
        if (isPlaying) {
            fadeOut(2000);
        } else {
            fadeIn(3000, 0.35);
        }
    };



    const runGenesisChatSequence = async () => {
        const sequence = [
            "IN THE BEGINNING",
            "THERE WAS ONLY HYDROGEN",
            "THEN CAME THE STARS",
            "AND THEY FORGED THE ELEMENTS"
        ];

        for (let i = 0; i < sequence.length; i++) {
            await new Promise(r => setTimeout(r, i === 0 ? 1000 : 2500));
            setMessages(prev => [...prev, {
                text: sequence[i],
                sender: 'bot',
                type: 'genesis'
            }]);
        }

        // Wait for final text to be read
        await new Promise(r => setTimeout(r, 2000));

        // Clear genesis messages
        setMessages(prev => prev.filter(m => m.type !== 'genesis'));

        // Big Bang
        const startTime = Date.now();
        const duration = 2000;
        const animateBigBang = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setGenesisProgress(easedProgress);
            if (progress < 1) requestAnimationFrame(animateBigBang);
            else {
                setIsGenesisRunning(false);
                setIsPresentationRunning(true);
            }
        };
        requestAnimationFrame(animateBigBang);
    };

    const handleStartExperience = () => {
        setAudioStarted(true);
        setIsPageLoading(false);
        setIsGenesisRunning(true);

        // Start audio fade in
        fadeIn(12000, 0.4);

        // Start chat sequence
        runGenesisChatSequence();
    };

    return (
        <div className="chat-area">
            {cinematicMode && (
                <CinematicBackground
                    mode={selectedModel}
                    intensity={genesisProgress}
                />
            )}



            {isPageLoading ? (
                <div className={`page-loader cinematic ${audioStarted ? 'fading-out' : ''}`}>
                    <ExplodingLoader onStart={handleStartExperience} />
                </div>
            ) : (
                <>
                    <div className="top-bar fade-in">
                        <div className="model-selector-wrapper">
                            <div className="model-selector" onClick={() => setShowModelDropdown(!showModelDropdown)}>
                                <span>{selectedModel === 'Chemini Advanced' ? 'Chemini Advanced (Presentation)' : 'ChemDFM (AI Model)'}</span>
                                <div className="dropdown-arrow">▼</div>
                            </div>
                            {showModelDropdown && (
                                <div className="model-dropdown">
                                    <div className="dropdown-item" onClick={() => toggleModel('Chemini Advanced')}>
                                        Chemini Advanced (Presentation)
                                    </div>
                                    <div className="dropdown-item" onClick={() => toggleModel('ChemDFM')}>
                                        ChemDFM (AI Model)
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="top-bar-actions">
                            <button className="audio-toggle" onClick={toggleAudio} title={isPlaying ? 'Mute' : 'Unmute'}>
                                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </button>
                            <div className="user-profile">
                                <div className="avatar">M</div>
                            </div>
                        </div>
                    </div>

                    <div className="main-content">
                        {messages.length === 0 && !isPresentationRunning && !isGenesisRunning ? (
                            <>
                                <div className="welcome-container cinematic-welcome">
                                    <h1 className="welcome-text">
                                        <span className="gradient-text shimmer">Hello, Mehar</span>
                                    </h1>
                                    <h2 className="sub-text fade-in">How can I help you today?</h2>
                                </div>

                                {selectedModel === 'ChemDFM' && (
                                    <div className="model-loader-card glass-card">
                                        <h3>ChemDFM Ready</h3>
                                        <p>Advanced Chemistry AI - Ask anything about chemistry!</p>
                                        <div className="loading-status ready">
                                            <Cpu size={24} />
                                            <span>Model Ready</span>
                                        </div>
                                    </div>
                                )}

                                {selectedModel === 'Chemini Advanced' && (
                                    <div className="suggestions-grid">
                                        {[
                                            { text: 'Brainstorm team bonding activities', icon: Compass },
                                            { text: 'How do I center a div?', icon: Code },
                                            { text: 'Draft an email to a recruiter', icon: Pencil },
                                            { text: 'Explain quantum computing', icon: Lightbulb },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className="suggestion-card glass-card"
                                                style={{ animationDelay: `${i * 0.1}s` }}
                                            >
                                                <p>{item.text}</p>
                                                <div className="icon-box"><item.icon size={24} /></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="messages-container">
                                {messages.map((msg, index) => {
                                    const showAvatar = msg.sender === 'bot' &&
                                        (index === 0 || messages[index - 1].sender !== 'bot');

                                    return (
                                        <div
                                            key={index}
                                            className={`message ${msg.sender} ${!showAvatar && msg.sender === 'bot' ? 'no-avatar' : ''} ${msg.type === 'genesis' ? 'genesis-message' : ''} fade-in-up`}
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
                                                        {msg.type === 'genesis' ? (
                                                            <span className={`genesis-text-content ${msg.text === "LET THERE BE LIGHT" ? "final-glow" : ""}`}>
                                                                {msg.text}
                                                            </span>
                                                        ) : cinematicMode && msg.sender === 'bot' ? (
                                                            <CinematicText text={msg.text} />
                                                        ) : (
                                                            msg.text
                                                        )}
                                                    </div>
                                                )}
                                                {msg.type === 'visual' && (
                                                    <div className="message-visual scale-in">
                                                        <MoleculeVisual type={msg.visualType} />
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

                    <div className="input-area-container">
                        <div className="input-box glass-input">
                            <div className="input-actions-left">
                                <button className="icon-btn"><Image size={24} /></button>
                            </div>
                            <input
                                type="text"
                                placeholder={selectedModel === 'ChemDFM' ? "Ask ChemDFM anything about chemistry..." : "Ask about AI in Chemistry..."}
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
                </>
            )}
        </div>
    );
};

export default ChatArea;
