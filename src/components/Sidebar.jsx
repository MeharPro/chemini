import React from 'react';
import { Menu, Plus, MessageSquare, HelpCircle, History, Settings, Sparkles } from 'lucide-react';

const Sidebar = () => {
    const handleEasterEgg = (type) => {
        switch (type) {
            case 'help':
                alert("Mr. May says: 'Why do chemists like nitrates so much? They're cheaper than day rates!'");
                break;
            case 'activity':
                alert("Mr. May asks: 'What comes after April? May!'");
                break;
            case 'settings':
                alert("Mr. May's Wisdom: 'If you're not part of the solution, you're part of the precipitate.'");
                break;
            default:
                break;
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <button className="menu-btn">
                    <Menu size={24} color="#c4c7c5" />
                </button>
                <button className="new-chat-btn">
                    <Plus size={20} />
                    <span>New chat</span>
                </button>

                <div className="recent-section">
                    <div className="section-title">Recent</div>
                    <div className="recent-item">
                        <MessageSquare size={18} />
                        <span>React Component Help</span>
                    </div>
                    <div className="recent-item">
                        <MessageSquare size={18} />
                        <span>Design System Ideas</span>
                    </div>
                </div>
            </div>

            <div className="sidebar-bottom">
                <div className="nav-item" onClick={() => handleEasterEgg('help')}>
                    <HelpCircle size={20} />
                    <span>Help</span>
                </div>
                <div className="nav-item" onClick={() => handleEasterEgg('activity')}>
                    <History size={20} />
                    <span>Activity</span>
                </div>
                <div className="nav-item" onClick={() => handleEasterEgg('settings')}>
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
    );
};

export default Sidebar;
