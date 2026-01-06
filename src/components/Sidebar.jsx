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
    {
        id: 'synthesis',
        title: "Synthesis Compounds",
        icon: MessageSquare,
        messages: [
            { text: "Hey Chemini! Can you help me synthesize some compounds?", sender: 'user' },
            { text: "Absolutely! I'd be happy to help you synthesize compounds. But first, a chemistry joke: Why did the chemist read the book about helium? Because he couldn't put it down! 😄\n\nNow, what compound would you like to synthesize? I can help with organic synthesis, inorganic preparations, or even suggest some fun demonstration reactions!", sender: 'bot' },
            { text: "Haha good one! What about making aspirin?", sender: 'user' },
            { text: "Ah, the classic acetylsalicylic acid synthesis! Here's how it works:\n\n**Reagents:** Salicylic acid + Acetic anhydride\n**Catalyst:** Phosphoric acid (or sulfuric acid)\n**Reaction:** Esterification!\n\nThe acetyl group from acetic anhydride replaces the hydrogen of the hydroxyl group on salicylic acid. Simple, elegant, and you end up with the world's most famous painkiller! 💊\n\nPro tip: If your aspirin smells like vinegar, you've got some unreacted acetic anhydride. Back to the lab bench! 🧪", sender: 'bot' }
        ]
    },
    {
        id: 'nitrates',
        title: "Why do chemists like nitrates?",
        icon: MessageSquare,
        messages: [
            { text: "Why do chemists like nitrates so much?", sender: 'user' },
            { text: "Because they're cheaper than day rates! 💰😂\n\nBut seriously, nitrates (NO₃⁻) are fascinating ions! They're:\n- Great oxidizers in fertilizers\n- Used in food preservation (that's why bacon exists!)\n- Key components in explosives (handle with care!)\n- Essential for the nitrogen cycle in nature\n\nThey're also highly soluble, which makes them great for chemistry experiments. Just remember: all nitrates are soluble in water - that's a solubility rule you can bank on!", sender: 'bot' },
            { text: "Got any more chemistry jokes?", sender: 'user' },
            { text: "Oh, I've got TONS! Here are some classics:\n\n🧪 I told a chemistry joke... there was no reaction.\n\n⚗️ Oxygen and Potassium went on a date. It was OK.\n\n🔬 Why can't you trust atoms? They make up everything!\n\n💎 What do you call a tooth in a glass of water? A one molar solution!\n\n🌡️ Why did the noble gas cry? Because all his friends Argon.\n\n😅 I would tell you a chemistry joke about Sodium... but Na.\n\nWant more? I've got an entire periodic table of them!", sender: 'bot' }
        ]
    },
    {
        id: 'speed',
        title: "Play 2x Speed",
        icon: MessageSquare,
        messages: [
            { text: "Hey can I play this presentation at 2x speed?", sender: 'user' },
            { text: "Ha! I appreciate your enthusiasm to speedrun my presentation! 🏃‍♂️💨\n\nUnfortunately... no. You cannot play this at 2x speed.\n\nWhy? Because the guy who made this (Mehar) would have to resync ALL the visuals to the 2x speed audio. We're talking about:\n- 12+ minutes of carefully timed captions\n- 30+ synchronized 3D visualizations\n- Neural networks that animate at specific moments\n- Protein ribbons that unfold on cue\n- Molecules that vibrate in sync with the narration\n\nSo basically, you'd be asking Mehar to NOT sleep for another week. 😴\n\nBesides, chemistry is meant to be savored, not speedrun! Take your time, enjoy the visuals, and let the knowledge... *diffuse* into your brain. Get it? Diffuse? 🧪😄", sender: 'bot' },
            { text: "Come on there has to be a way!", sender: 'user' },
            { text: "Alright, alright, I'll tell you the SECRET method to watch at 2x speed. Lean in close...\n\n🤫 *whispers*\n\n...watch it twice at 1x speed. Same content, double the learning!\n\nOR you could:\n1. Drink twice as much coffee ☕☕\n2. Convince yourself time is relative (thanks Einstein)\n3. Use the slider to skip to parts you want to see\n4. Accept that good things take time - like slow reactions reaching equilibrium!\n\nI'm designed to be engaging at 1x speed. Trust the process! The 3D molecule visualizations hit different when they're properly timed with my silky smooth narration. 🎭✨\n\n*This message was brought to you by: Mehar, who definitely doesn't want to resync 700+ lines of animation code*", sender: 'bot' }
        ]
    },
];

// Export recentChats so ChatArea can access them
export { recentChats };

const Sidebar = ({ selectedModel, setSelectedModel, isOpen = true, onToggle, glowDropdown, setGlowDropdown, activeRecentChat, setActiveRecentChat }) => {
    const [showModelDropdown, setShowModelDropdown] = React.useState(false);
    const [activeJoke, setActiveJoke] = React.useState(null);

    // Dismiss glow when user interacts with the dropdown
    const handleDropdownClick = () => {
        if (glowDropdown && setGlowDropdown) {
            setGlowDropdown(false);
        }
        setShowModelDropdown(!showModelDropdown);
    };

    const handleRecentChatClick = (chat) => {
        // Switch to ChemDFM model when opening a recent chat
        setSelectedModel('ChemDFM');
        setActiveRecentChat(chat);
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
                <div className="sidebar-top">
                    <button className="menu-btn" onClick={onToggle}>
                        <Menu size={24} color="#c4c7c5" />
                    </button>
                    <button className="new-chat-btn" onClick={() => {
                        setSelectedModel('ChemDFM');
                        setActiveRecentChat(null);
                    }}>
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
                        {recentChats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`recent-item ${activeRecentChat?.id === chat.id ? 'active' : ''}`}
                                onClick={() => handleRecentChatClick(chat)}
                                style={{ cursor: 'pointer' }}
                            >
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

