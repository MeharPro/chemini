import React from 'react';
import { Atom, TrendingUp, Zap, FlaskConical, Brain, Network, Sparkles } from 'lucide-react';
import './MoleculeVisual.css';

const MoleculeVisual = ({ type }) => {
    const renderContent = () => {
        switch (type) {
            case 'protein':
                return (
                    <div className="visual-card protein-visual">
                        <div className="visual-glow"></div>
                        <div className="helix-container">
                            <div className="helix">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="helix-node" style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="node-ball"></div>
                                        <div className="node-connector"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="visual-label">
                            <Atom size={16} />
                            <span>AlphaFold Protein Structure Prediction</span>
                        </div>
                    </div>
                );

            case 'reaction':
                return (
                    <div className="visual-card reaction-visual">
                        <div className="visual-glow"></div>
                        <div className="reaction-flow">
                            <div className="molecule-node start">
                                <FlaskConical size={24} />
                                <span>Reactants</span>
                            </div>
                            <div className="reaction-arrow">
                                <div className="arrow-line"></div>
                                <div className="arrow-particles">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="particle" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                    ))}
                                </div>
                                <Zap className="catalyst-icon" size={18} />
                            </div>
                            <div className="molecule-node mid">
                                <Brain size={24} />
                                <span>AI Analysis</span>
                            </div>
                            <div className="reaction-arrow">
                                <div className="arrow-line"></div>
                                <div className="arrow-particles">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="particle" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="molecule-node end">
                                <Sparkles size={24} />
                                <span>Products</span>
                            </div>
                        </div>
                        <div className="visual-label">
                            <Network size={16} />
                            <span>AI-Planned Retrosynthesis Pathway</span>
                        </div>
                    </div>
                );

            case 'graph':
                return (
                    <div className="visual-card graph-visual">
                        <div className="visual-glow"></div>
                        <div className="chart-container">
                            <div className="chart-title">Model Performance Over Time</div>
                            <div className="chart-area">
                                <div className="y-axis">
                                    <span>100%</span>
                                    <span>75%</span>
                                    <span>50%</span>
                                    <span>25%</span>
                                </div>
                                <div className="bars">
                                    {[
                                        { label: '2018', value: 35, color: '#666' },
                                        { label: '2020', value: 55, color: '#888' },
                                        { label: '2022', value: 75, color: '#a8c7fa' },
                                        { label: '2024', value: 92, color: '#4b90ff' },
                                    ].map((bar, i) => (
                                        <div key={i} className="bar-column">
                                            <div
                                                className="bar"
                                                style={{
                                                    height: `${bar.value}%`,
                                                    background: `linear-gradient(180deg, ${bar.color}, ${bar.color}88)`,
                                                    animationDelay: `${i * 0.15}s`
                                                }}
                                            ></div>
                                            <span className="bar-label">{bar.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="visual-label">
                            <TrendingUp size={16} />
                            <span>Chemical AI Accuracy Improvements</span>
                        </div>
                    </div>
                );

            case 'network':
                return (
                    <div className="visual-card network-visual">
                        <div className="visual-glow"></div>
                        <div className="neural-network">
                            {[0, 1, 2, 3].map((layer) => (
                                <div key={layer} className="network-layer">
                                    {[...Array(layer === 1 || layer === 2 ? 5 : 3)].map((_, node) => (
                                        <div
                                            key={node}
                                            className="network-node"
                                            style={{ animationDelay: `${(layer * 3 + node) * 0.1}s` }}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                            <svg className="network-connections" viewBox="0 0 300 150">
                                {/* Connections rendered via CSS animation */}
                            </svg>
                        </div>
                        <div className="visual-label">
                            <Brain size={16} />
                            <span>Transformer Neural Architecture</span>
                        </div>
                    </div>
                );

            case 'molecule3d':
                return (
                    <div className="visual-card molecule3d-visual">
                        <div className="visual-glow"></div>
                        <div className="molecule-3d">
                            <div className="atom central"></div>
                            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                                <div
                                    key={i}
                                    className="atom orbital"
                                    style={{
                                        transform: `rotate(${angle}deg) translateX(50px)`,
                                        animationDelay: `${i * 0.2}s`
                                    }}
                                >
                                    <div className="bond"></div>
                                </div>
                            ))}
                        </div>
                        <div className="visual-label">
                            <Atom size={16} />
                            <span>Molecular Structure Visualization</span>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="visual-card default-visual">
                        <div className="visual-glow"></div>
                        <Atom size={48} className="default-icon" />
                        <span>Chemical Visualization</span>
                    </div>
                );
        }
    };

    return (
        <div className="molecule-visual-wrapper">
            {renderContent()}
        </div>
    );
};

export default MoleculeVisual;
