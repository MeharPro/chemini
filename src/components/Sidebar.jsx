import React from 'react';
import { Menu, Plus, MessageSquare, HelpCircle, History, Settings, Sparkles, X } from 'lucide-react';

const jokes = {
    help: {
        title: "Chemistry Help",
        joke: "Why do chemists like nitrates so much? They're cheaper than day rates! 💰"
    },
    activity: {
        title: "Mr. May's Riddle",
        joke: "What month comes after April? May! 🗓️ (Shoutout to the best chemistry teacher!)"
    },
    settings: {
        title: "Settings Wisdom",
        joke: "If you're not part of the solution, you're part of the precipitate. Remember that! 🔬"
    }
};

const recentChats = [
    { title: "Synthesis Compounds", icon: MessageSquare },
    { title: "Why do chemists like nitrates?", icon: MessageSquare },
    { title: "What's a chemist's favorite tree?", icon: MessageSquare },
];

const Sidebar = ({ selectedModel, setSelectedModel, isOpen = true, onToggle, glowDropdown, setGlowDropdown }) => {
    const [showModelDropdown, setShowModelDropdown] = React.useState(false);
    const [activeJoke, setActiveJoke] = React.useState(null);

    // Dismiss glow when user interacts with the dropdown
    const handleDropdownClick = () => {
        if (glowDropdown && setGlowDropdown) {
            setGlowDropdown(false);
        }
        setShowModelDropdown(!showModelDropdown);
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
                <div className="sidebar-top">
                    <button className="menu-btn" onClick={onToggle}>
                        <Menu size={24} color="#c4c7c5" />
                    </button>
                    <button className="new-chat-btn">
                        <Plus size={20} />
                        <span>New chat</span>
                    </button>

                    {/* Model Selector */}
                    <div className="model-selector-wrapper" style={{ margin: '10px 0', padding: '0 10px' }}>
                        <div
                            className={`model-selector ${glowDropdown ? 'glow-attention' : ''}`}
                            onClick={handleDropdownClick}
                            style={{ width: '100%', justifyContent: 'space-between' }}
                        >
                            <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {selectedModel === 'Chemini Advanced' ? 'Chemini Advanced' : 'ChemDFM'}
                            </span>
                            <div className="dropdown-arrow">▼</div>
                        </div>
                        {showModelDropdown && (
                            <div className="model-dropdown" style={{ top: '100%', left: '10px', width: 'calc(100% - 20px)' }}>
                                <div className="dropdown-item" onClick={() => { setSelectedModel('Chemini Advanced'); setShowModelDropdown(false); }}>
                                    Chemini Advanced
                                </div>
                                <div className="dropdown-item" onClick={() => { setSelectedModel('ChemDFM'); setShowModelDropdown(false); }}>
                                    ChemDFM
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="recent-section">
                        <div className="section-title">Recent</div>
                        {recentChats.map((chat, i) => (
                            <div key={i} className="recent-item">
                                <chat.icon size={18} />
                                <span>{chat.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-bottom">
                    <div className="nav-item" onClick={() => setActiveJoke('help')}>
                        <HelpCircle size={20} />
                        <span>Help</span>
                    </div>
                    <div className="nav-item" onClick={() => setActiveJoke('activity')}>
                        <History size={20} />
                        <span>Activity</span>
                    </div>
                    <div className="nav-item" onClick={() => setActiveJoke('settings')}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                    <div className="location-indicator">
                        <div className="dot"></div>
                        <span>Milton, ON</span>
                    </div>
                    <div className="attribution">
                        Made by Mehar
                    </div>
                </div>
            </div>

            {/* Joke Modal */}
            {activeJoke && (
                <div className="joke-modal-overlay" onClick={() => setActiveJoke(null)}>
                    <div className="joke-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="joke-close" onClick={() => setActiveJoke(null)}>
                            <X size={20} />
                        </button>
                        <div className="joke-icon">🧪</div>
                        <h3 className="joke-title">{jokes[activeJoke].title}</h3>
                        <p className="joke-text">{jokes[activeJoke].joke}</p>
                        <button className="joke-dismiss" onClick={() => setActiveJoke(null)}>
                            Ha ha! 😄
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;

