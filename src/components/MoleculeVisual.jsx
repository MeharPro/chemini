import React from 'react';
import { Atom, TrendingUp, Zap, FlaskConical, Brain, Network, Sparkles } from 'lucide-react';
import './MoleculeVisual.css';
import ThreeMolecule from './ThreeMolecule';
import ReactionRateSim from './ReactionRateSim';

const MoleculeVisual = ({ type }) => {
    const renderContent = () => {
        switch (type) {


            case 'reaction':
                return (
                    <div className="visual-card reaction-visual">
                        <div className="visual-glow"></div>
                        <div className="reaction-flow">
                            <div className="molecule-node start">
                                <FlaskConical size={24} />
                                <span>Complex Target</span>
                                <small style={{ fontSize: '10px', opacity: 0.7 }}>C₂₄H₂₆O₅</small>
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
                                <span>Atom-Anchored LLM</span>
                                <small style={{ fontSize: '10px', opacity: 0.7 }}>≥90% accuracy</small>
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
                                <span>Simple Precursors</span>
                                <small style={{ fontSize: '10px', opacity: 0.7 }}>Available</small>
                            </div>
                        </div>
                        <div className="visual-label">
                            <Network size={16} />
                            <span>AI Retrosynthesis (arXiv:2510.16590)</span>
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
                    <div className="visual-card molecule3d-visual" style={{ padding: 0, height: '400px' }}>
                        {/* Removed visual-glow to ensure orbit controls work without overlay blocking events */}
                        <ThreeMolecule type="molecule3d" />
                        <div className="visual-label" style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: 10 }}>
                            <Atom size={16} />
                            <span>Interactive 3D Structure (Drag to Rotate)</span>
                        </div>
                    </div>
                );

            case 'protein':
                return (
                    <div className="visual-card protein-visual" style={{ padding: 0, height: '400px' }}>
                        <ThreeMolecule type="protein" />
                        <div className="visual-label" style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: 10 }}>
                            <Atom size={16} />
                            <span>AlphaFold Protein Structure Prediction</span>
                        </div>
                    </div>
                );



            case 'kinetics':
                return (
                    <div className="visual-card kinetics-visual" style={{ padding: 0, height: 'auto', overflow: 'hidden' }}>
                        <div className="visual-glow"></div>
                        <ReactionRateSim />
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
