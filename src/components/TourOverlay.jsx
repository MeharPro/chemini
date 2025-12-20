import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Mouse, Move3D, Eye, MessageSquare, BookOpen, Sparkles } from 'lucide-react';
import './TourOverlay.css';

const tourSteps = [
    {
        title: "Welcome to Chemini!",
        description: "Let me give you a quick tour of what you can explore here.",
        icon: Sparkles,
        highlight: null
    },
    {
        title: "3D Interactive Scene",
        description: "You can orbit, zoom, and pan around the 3D visualizations. Try clicking and dragging!",
        icon: Move3D,
        highlight: 'canvas'
    },
    {
        title: "Zoom Controls",
        description: "Scroll to zoom in and out. Get closer to the molecules and neural networks!",
        icon: Eye,
        highlight: 'canvas'
    },
    {
        title: "ChemDFM Chat Mode",
        description: "Switch to 'ChemDFM' in the dropdown to chat with the chemistry AI model.",
        icon: MessageSquare,
        highlight: 'dropdown'
    },
    {
        title: "Citations & References",
        description: "Click the Citations button to see all arXiv papers and sources used.",
        icon: BookOpen,
        highlight: 'citations'
    }
];

const TourOverlay = ({ isVisible, onClose, showAtEnd = false }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setCurrentStep(0);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const step = tourSteps[currentStep];
    const Icon = step.icon;

    const nextStep = () => {
        if (currentStep < tourSteps.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                setIsAnimating(false);
            }, 200);
        } else {
            onClose();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setIsAnimating(false);
            }, 200);
        }
    };

    return (
        <div className="tour-overlay">
            {/* Darkened backdrop */}
            <div className="tour-backdrop" onClick={onClose} />

            {/* Tour card */}
            <div className={`tour-card ${isAnimating ? 'animating' : ''}`}>
                {/* Close button */}
                <button className="tour-close" onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Step indicator */}
                <div className="tour-steps">
                    {tourSteps.map((_, i) => (
                        <div
                            key={i}
                            className={`tour-step-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                        />
                    ))}
                </div>

                {/* Icon */}
                <div className="tour-icon">
                    <Icon size={48} />
                </div>

                {/* Content */}
                <h2 className="tour-title">{step.title}</h2>
                <p className="tour-description">{step.description}</p>

                {/* Navigation */}
                <div className="tour-navigation">
                    <button
                        className="tour-btn tour-prev"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>
                    <button className="tour-btn tour-next" onClick={nextStep}>
                        {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Skip link */}
                <button className="tour-skip" onClick={onClose}>
                    Skip tour
                </button>
            </div>

            {/* Highlight pointer (optional - for specific elements) */}
            {step.highlight && (
                <div className={`tour-highlight tour-highlight-${step.highlight}`} />
            )}
        </div>
    );
};

export default TourOverlay;
