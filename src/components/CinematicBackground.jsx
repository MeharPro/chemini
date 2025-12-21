import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import './CinematicBackground.css';
import {
    SceneInit, MorphDuality, SpeedText, ChemRevolution, MoleculePrediction,
    NeuralNet, TransformerBlocks, DataIngest, AlphaFold, FoundationModels,
    SystemPrompts, ViolationBlock, RetroSynthesisMaze, ChemDFNBooks,
    MillionScientists, SmilesCode, CollisionTheory, ToolsAugment,
    QuestionMark, ComputerChip, FloatingToolkit,
    // NEW DETAILED VISUALIZATIONS
    NeuralNetworkDots, BrainNeurons, EvolutionTimeline, FlyingLetters,
    SystemPromptsDisplay, ChemistryRulesDisplay, SynthesisRoadmap,
    BigNumbersDisplay, ProteinStructure, ProteinInteraction,
    RetrosynthesisBackwards, CollisionSimulation,
    // LATEST ADDITIONS
    ChemDFMMolecule, ScalePyramidComparison, GraphNeuralNetwork, AIEvolutionChart,
    // BIOLOGY VISUALIZATIONS
    StructuralBiology, AlphaFoldOutput, StructureVsFunction, DisorderedProtein
} from './VisualComponents';

// --- SCENE MANAGER ---

const SceneContent = ({ visualType, isPlaying, temperature }) => {
    switch (visualType) {
        case 'scene_init':
            return <SceneInit />;
        case 'morph_duality':
            return <MorphDuality isPlaying={isPlaying} />;
        case 'speed_text':
            return <SpeedText isPlaying={isPlaying} frozen={false} />;
        case 'freeze_moment':
            return <SpeedText isPlaying={isPlaying} frozen={true} />;
        case 'chem_revolution':
            return <ChemRevolution />;
        case 'molecule_prediction':
            return <MoleculePrediction isPlaying={isPlaying} />;
        case 'question_big':
            return <QuestionMark />;
        case 'computer_chip':
            return <ComputerChip />;
        case 'toolkit_box':
            return <FloatingToolkit />;
        case 'neural_net_intro':
            return <NeuralNet mode="layer" />;
        case 'graph_net':
            return <NeuralNet mode="graph" />;
        case 'transformer_blocks':
            return <TransformerBlocks />;
        case 'neural_branching':
            return <NeuralNet mode="branching" />;
        case 'data_ingest':
            return <DataIngest isPlaying={isPlaying} />;
        case 'alpha_fold':
            return <AlphaFold />;
        case 'foundation_models':
            return <FoundationModels />;
        case 'system_prompts':
            return <SystemPrompts />;
        case 'violation_block':
            return <ViolationBlock />;
        case 'retro_synthesis_maze':
            return <RetroSynthesisMaze />;
        case 'chem_dfn_books':
            return <ChemDFNBooks />;
        case 'million_scientists':
            return <MillionScientists />;
        case 'smiles_code':
            return <SmilesCode />;
        case 'collision_theory':
            return <CollisionTheory isPlaying={isPlaying} />;
        case 'tools_augment':
            return <ToolsAugment />;
        // NEW DETAILED VISUALIZATIONS
        case 'neural_network_dots':
            return <NeuralNetworkDots isPlaying={isPlaying} />;
        case 'brain_neurons':
            return <BrainNeurons isPlaying={isPlaying} />;
        case 'evolution_timeline':
            return <EvolutionTimeline />;
        case 'flying_letters':
            return <FlyingLetters isPlaying={isPlaying} />;
        case 'system_prompts_display':
            return <SystemPromptsDisplay />;
        case 'chemistry_rules':
            return <ChemistryRulesDisplay />;
        case 'synthesis_roadmap':
            return <SynthesisRoadmap isPlaying={isPlaying} />;
        case 'big_numbers_display':
            return <BigNumbersDisplay />;
        case 'protein_structure':
            return <ProteinStructure isPlaying={isPlaying} />;
        case 'protein_interaction':
            return <ProteinInteraction isPlaying={isPlaying} />;
        case 'retrosynthesis_backwards':
            return <RetrosynthesisBackwards isPlaying={isPlaying} />;
        case 'collision_simulation':
            return <CollisionSimulation isPlaying={isPlaying} temperature={temperature} />;
        // LATEST ADDITIONS
        case 'chemdfm_molecule':
            return <ChemDFMMolecule isPlaying={isPlaying} />;
        case 'scale_pyramid':
            return <ScalePyramidComparison isPlaying={isPlaying} />;
        case 'graph_neural_network':
            return <GraphNeuralNetwork isPlaying={isPlaying} />;
        case 'ai_evolution_chart':
            return <AIEvolutionChart isPlaying={isPlaying} />;
        // BIOLOGY VISUALIZATIONS
        case 'structural_biology':
            return <StructuralBiology isPlaying={isPlaying} />;
        case 'alphafold_output':
            return <AlphaFoldOutput isPlaying={isPlaying} />;
        case 'structure_vs_function':
            return <StructureVsFunction isPlaying={isPlaying} />;
        case 'disordered_protein':
            return <DisorderedProtein isPlaying={isPlaying} />;
        default:
            // Fallback
            return <SceneInit />;
    }
};

const CinematicBackground = ({ mode = 'default', intensity = 1, visualType = 'scene_init', isPlaying = true, temperature = 50 }) => {
    return (
        <div className="cinematic-canvas-container">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
                <color attach="background" args={['#050510']} />

                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -5]} intensity={0.8} color="#4b90ff" />

                {/* Stars Background */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={isPlaying ? 0.5 : 0} />

                {/* Dynamic Content */}
                <SceneContent visualType={visualType} isPlaying={isPlaying} temperature={temperature} />

                {/* Controls - Always Active */}
                <OrbitControls enableZoom={true} enablePan={false} autoRotate={visualType === 'freeze_moment' || visualType === 'chem_dfn_books'} autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default CinematicBackground;
