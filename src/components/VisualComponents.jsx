
import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Stars, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

// Custom SimpleLine component to replace drei's Line (which has context issues)
const SimpleLine = ({ points, color = 'white', lineWidth = 1 }) => {
    const lineRef = useRef();

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = [];
        points.forEach(point => {
            if (Array.isArray(point)) {
                positions.push(point[0], point[1], point[2] || 0);
            } else {
                positions.push(point.x, point.y, point.z || 0);
            }
        });
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        return geo;
    }, [points]);

    return (
        <line ref={lineRef} geometry={geometry}>
            <lineBasicMaterial color={color} linewidth={lineWidth} />
        </line>
    );
};


// 1. Scene Init
export const SceneInit = () => {
    return (
        <group>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <fog attach="fog" args={['#050510', 0, 100]} />
            <Dust count={200} />
        </group>
    );
};

const Dust = ({ count }) => {
    const mesh = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50,
                z: (Math.random() - 0.5) * 50,
                speed: Math.random() * 0.02
            })
        }
        return temp;
    }, [count]);

    useFrame(() => {
        if (!mesh.current) return;
        particles.forEach((p, i) => {
            p.y += p.speed; // drift up
            if (p.y > 25) p.y = -25;
            dummy.position.set(p.x, p.y, p.z);
            dummy.rotation.set(0, p.y, 0);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        })
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color="#444466" transparent opacity={0.4} />
        </instancedMesh>
    )
}

// 2. Morph Duality (Heart Split)
export const MorphDuality = ({ isPlaying }) => {
    const group = useRef();
    // Two halves of a heart
    useFrame((state) => {
        if (group.current && isPlaying) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
    });

    return (
        <group ref={group}>
            {/* Left Half - Organic Red */}
            <group position={[-1, 0, 0]}>
                <mesh position={[0.5, 0, 0]}>
                    <sphereGeometry args={[1, 32, 32, 0, Math.PI]} />
                    <meshStandardMaterial color="#ff0040" emissive="#500010" roughness={0.4} />
                </mesh>
                <mesh position={[0.5, -1, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <coneGeometry args={[1, 2, 32]} />
                    <meshStandardMaterial color="#ff0040" />
                </mesh>
            </group>

            {/* Right Half - Metallic Green/Circuit */}
            <group position={[1, 0, 0]}>
                <mesh position={[-0.5, 0, 0]}>
                    <sphereGeometry args={[1, 32, 32, Math.PI, Math.PI]} />
                    <meshStandardMaterial color="#00ff80" metalness={1} roughness={0.1} wireframe />
                </mesh>
                <mesh position={[-0.5, -1, 0]} rotation={[0, 0, -Math.PI / 4]}>
                    <coneGeometry args={[1, 2, 32]} />
                    <meshStandardMaterial color="#00ff80" metalness={1} wireframe />
                </mesh>
            </group>
        </group>
    );
};

// 3. Speed Text (Flying Papers)
export const SpeedText = ({ isPlaying, frozen = false }) => {
    const count = 50;
    const meshRef = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current) return;
        if (frozen) {
            // Rotate slightly when frozen
            meshRef.current.rotation.y += 0.001;
            return;
        }

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            // Move fast along Z
            t = particle.t += speed * 5;
            const dummy = new THREE.Object3D();

            dummy.position.set(
                xFactor + Math.cos(t) + Math.sin(t * 1) / 10,
                yFactor + Math.sin(t) + Math.cos(t * 2) / 10,
                (zFactor + (state.clock.elapsedTime * 50)) % 100 - 50
            );

            dummy.rotation.set(Math.cos(t), Math.sin(t), Math.cos(t));
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <planeGeometry args={[1.5, 2]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.6} />
        </instancedMesh>
    );
};

// 5. Chem Revolution (Wireframe Lab)
export const ChemRevolution = () => {
    return (
        <group>
            {/* Floor Grid */}
            <gridHelper args={[100, 50, 0x00ffff, 0x222222]} />
            {/* Floating Molecules */}
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Molecule position={[0, 2, 0]} scale={0.5} />
                <Molecule position={[5, 4, -5]} scale={0.3} color="orange" />
                <Molecule position={[-5, 3, 5]} scale={0.4} color="cyan" />
            </Float>
        </group>
    );
};

const Molecule = ({ position = [0, 0, 0], scale = 1, color = "hotpink" }) => (
    <group position={position} scale={scale}>
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[1.5, 1, 0]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-1.5, 1, 0]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial color="white" />
        </mesh>
        {/* Bonds */}
        <mesh position={[0.75, 0.5, 0]} rotation={[0, 0, -1]}>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial color="gray" />
        </mesh>
        <mesh position={[-0.75, 0.5, 0]} rotation={[0, 0, 1]}>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    </group>
);

// 6. Molecule Prediction
export const MoleculePrediction = ({ isPlaying }) => {
    const molRef = useRef();
    const hullRef = useRef();

    useFrame((state) => {
        if (isPlaying) {
            // Violent Vibration
            molRef.current.position.x = Math.sin(state.clock.elapsedTime * 50) * 0.1;
            molRef.current.position.y = Math.cos(state.clock.elapsedTime * 40) * 0.1;

            // Pulse hull
            const s = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            hullRef.current.scale.set(s, s, s);
            hullRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group>
            <group ref={molRef}>
                <Molecule color="#ff0000" />
            </group>
            <mesh ref={hullRef}>
                <icosahedronGeometry args={[2, 1]} />
                <meshStandardMaterial color="#00ff00" wireframe transparent opacity={0.3} />
            </mesh>
        </group>
    );
}

// 7. Neural Net & 8. Graph Net & 10. Neural Branching
export const NeuralNet = ({ mode = 'layer' }) => {
    // Mode can be 'layer', 'graph', 'branching'

    // Layer Layout
    const layerPositions = useMemo(() => {
        const p = [];
        for (let i = 0; i < 5; i++) p.push(new THREE.Vector3(-4, (i - 2) * 1.5, 0));
        for (let i = 0; i < 6; i++) p.push(new THREE.Vector3(-1, (i - 2.5) * 1.5, 0));
        for (let i = 0; i < 6; i++) p.push(new THREE.Vector3(2, (i - 2.5) * 1.5, 0));
        for (let i = 0; i < 3; i++) p.push(new THREE.Vector3(5, (i - 1) * 1.5, 0));
        return p;
    }, []);

    // Graph Layout
    const graphPositions = useMemo(() => {
        const p = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            p.push(new THREE.Vector3(Math.cos(angle) * 3, Math.sin(angle) * 3, 0));
            if (i === 0) p.push(new THREE.Vector3(0, 0, 0));
        }
        return p;
    }, []);

    // Branching Layout (Tree)
    const branchingPositions = useMemo(() => {
        const p = [];
        // Root
        p.push(new THREE.Vector3(0, -3, 0));
        // Level 1
        p.push(new THREE.Vector3(-2, -1, 0));
        p.push(new THREE.Vector3(0, -1, 0));
        p.push(new THREE.Vector3(2, -1, 0));
        // Level 2 (some branches)
        p.push(new THREE.Vector3(-3, 1, 0));
        p.push(new THREE.Vector3(-1, 1, 0));
        p.push(new THREE.Vector3(1, 1, 0));
        p.push(new THREE.Vector3(3, 1, 0));
        // Decision Path (glows)
        return p;
    }, []);

    const positions = (mode === 'graph' ? graphPositions : (mode === 'branching' ? branchingPositions : layerPositions));

    return (
        <group>
            {positions.map((pos, i) => {
                // In branching mode, highlight the "decision path" (e.g., indices 0, 2, 6)
                const isDecision = mode === 'branching' && (i === 0 || i === 2 || i === 6);
                const color = isDecision ? "#ffff00" : (mode === 'graph' ? "#00ffff" : "#4444ff");

                return (
                    <mesh key={i} position={pos}>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDecision ? 2 : 1} />
                    </mesh>
                )
            })}

            {/* Visual Connections connecting all to all nearby for simple effect */}
            {mode === 'branching' && (
                <SimpleLine points={[[0, -3, 0], [0, -1, 0], [1, 1, 0]]} color="yellow" lineWidth={4} />
            )}
        </group>
    );
}

// 9. Transformer Blocks
export const TransformerBlocks = () => {
    const count = 20;
    return (
        <group>
            {Array.from({ length: count }).map((_, i) => (
                <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={[Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5]}>
                        <boxGeometry args={[0.8, 0.8, 0.8]} />
                        <meshStandardMaterial color={i % 3 === 0 ? "gold" : "silver"} metalness={0.8} roughness={0.2} />
                    </mesh>
                </Float>
            ))}
            <mesh position={[0, 0, -10]}>
                <boxGeometry args={[5, 8, 5]} />
                <meshStandardMaterial color="#222" wireframe />
            </mesh>
        </group>
    )
}

// 11. Data Ingest
export const DataIngest = ({ isPlaying }) => {
    const mesh = useRef();
    const count = 400;

    // Spiral logic
    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.elapsedTime;
        for (let i = 0; i < count; i++) {
            // Calculate a tornado/spiral shape
            const angle = i * 0.1 + time;
            const radius = 5 - (i / count) * 4 + Math.sin(time + i) * 0.5;
            const y = (i / count) * 10 - 5;

            const dummy = new THREE.Object3D();
            dummy.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            dummy.scale.setScalar(0.1);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        }
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#00ff00" wireframe />
        </instancedMesh>
    );
}

// 12. Alpha Fold
export const AlphaFold = () => {
    // Generate a curve for ribbon
    const curve = useMemo(() => {
        const points = [];
        for (let i = 0; i < 50; i++) {
            points.push(new THREE.Vector3(
                Math.sin(i * 0.5) * 3,
                (i - 25) * 0.2,
                Math.cos(i * 0.5) * 3
            ));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    return (
        <group>
            <mesh>
                <tubeGeometry args={[curve, 64, 0.4, 8, false]} />
                <meshStandardMaterial color="cyan" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

// 13. Foundation Models (Token Brain)
export const FoundationModels = () => {
    const count = 500;
    const mesh = useRef();

    useFrame((state) => {
        if (!mesh.current) return;
        // Pulse brain effect
        const t = state.clock.elapsedTime;
        mesh.current.rotation.y = t * 0.1;
    });

    // Brain shape approx (sphere deformed)
    const particles = useMemo(() => {
        const p = [];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 4 + Math.random();
            p.push({
                pos: new THREE.Vector3(
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta) * 0.8, // flatten y
                    r * Math.cos(phi)
                )
            });
        }
        return p;
    }, []);

    // Update instance matrices
    useFrame(() => {
        if (mesh.current) {
            const dummy = new THREE.Object3D();
            particles.forEach((p, i) => {
                dummy.position.set(p.pos.x, p.pos.y, p.pos.z);
                dummy.updateMatrix();
                mesh.current.setMatrixAt(i, dummy.matrix);
            });
            mesh.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group>
            <instancedMesh ref={mesh} args={[null, null, count]}>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="#8844ff" emissive="#220055" />
            </instancedMesh>
        </group>
    )
}

// 14. System Prompts
export const SystemPrompts = () => {
    return (
        <group>
            {/* Brain center */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Floating Shields */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
                <group position={[3, 0, 3]}>
                    <Text fontSize={0.5} color="#00ffff" anchorX="center" anchorY="middle">
                        CONSERVE MASS
                    </Text>
                    <mesh position={[0, 0, -0.1]}>
                        <planeGeometry args={[5, 1]} />
                        <meshBasicMaterial color="blue" transparent opacity={0.3} side={THREE.DoubleSide} />
                    </mesh>
                </group>
                <group position={[-3, 1, 0]} rotation={[0, Math.PI / 3, 0]}>
                    <Text fontSize={0.5} color="#00ffff" anchorX="center" anchorY="middle">
                        VALENCE RULES
                    </Text>
                    <mesh position={[0, 0, -0.1]}>
                        <planeGeometry args={[5, 1]} />
                        <meshBasicMaterial color="blue" transparent opacity={0.3} side={THREE.DoubleSide} />
                    </mesh>
                </group>
                <group position={[0, -2, 3]} rotation={[0, -Math.PI / 3, 0]}>
                    <Text fontSize={0.5} color="#00ffff" anchorX="center" anchorY="middle">
                        SAFETY FIRST
                    </Text>
                    <mesh position={[0, 0, -0.1]}>
                        <planeGeometry args={[5, 1]} />
                        <meshBasicMaterial color="blue" transparent opacity={0.3} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            </Float>
        </group>
    )
}

// 15. Violation Block
export const ViolationBlock = () => {
    return (
        <group>
            <Float speed={5} rotationIntensity={2}>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </Float>
            {/* Big X */}
            <group position={[0, 0, 2]}>
                <mesh rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[4, 0.5, 0.5]} />
                    <meshBasicMaterial color="red" />
                </mesh>
                <mesh rotation={[0, 0, -Math.PI / 4]}>
                    <boxGeometry args={[4, 0.5, 0.5]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            </group>
        </group>
    )
}

// 16. Retro Synthesis Maze
export const RetroSynthesisMaze = () => {
    return (
        <group rotation={[Math.PI / 4, 0, 0]}>
            {/* Simple Grid Maze */}
            <gridHelper args={[20, 10, 0xff00ff, 0x220022]} />
            {/* Path */}
            <SimpleLine
                points={[
                    [0, 0, 0], [2, 0, 0], [2, 0, 2], [-2, 0, 2], [-2, 0, 4], [5, 0, 4]
                ]}
                color="cyan"
                lineWidth={5}
            />
            <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="gold" />
            </mesh>
        </group>
    )
}

// 17. Chem DFM Books
export const ChemDFNBooks = () => {
    const count = 200;
    // Sphere distribution
    const mesh = useRef();
    useFrame((state) => {
        if (mesh.current) mesh.current.rotation.y += 0.005;
    })

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <boxGeometry args={[0.5, 0.8, 0.1]} />
            <meshNormalMaterial />
            {Array.from({ length: count }).map((_, i) => {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const r = 8;
                return (
                    <Instance
                        key={i}
                        position={[
                            r * Math.sin(phi) * Math.cos(theta),
                            r * Math.sin(phi) * Math.sin(theta),
                            r * Math.cos(phi)
                        ]}
                        lookAt={[0, 0, 0]} // Look at center (inverse?)
                    />
                )
            })}
        </instancedMesh>
    )
}

// 18. Million Scientists - Massive crowd visualization
export const MillionScientists = ({ isPlaying }) => {
    const count = 500; // Lots of scientists!
    const meshRef = useRef();
    const groupRef = useRef();

    // Generate positions with some randomness for natural crowd look
    const positions = useMemo(() => {
        const pos = [];
        for (let i = 0; i < count; i++) {
            // Spread in a circular/stadium formation
            const angle = (i / count) * Math.PI * 8 + Math.random() * 0.5;
            const radius = 2 + (i / count) * 8 + Math.random() * 1.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = Math.random() * 0.2; // Slight height variation
            pos.push({ x, y, z });
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            const dummy = new THREE.Object3D();
            positions.forEach((p, i) => {
                // Subtle wave animation
                const wave = isPlaying ? Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.05 : 0;
                dummy.position.set(p.x, p.y + wave, p.z);
                dummy.rotation.y = Math.atan2(p.x, p.z); // Face center
                dummy.scale.setScalar(0.5 + Math.random() * 0.1); // Size variation
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Title */}
            <Text position={[0, 5, 0]} fontSize={0.7} color="#ffffff">
                A Million Scientists
            </Text>
            <Text position={[0, 4.3, 0]} fontSize={0.35} color="#888888">
                Global Research Community
            </Text>

            {/* Massive crowd of scientists */}
            <instancedMesh ref={meshRef} args={[null, null, count]}>
                <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
                <meshStandardMaterial color="#4488ff" emissive="#224488" emissiveIntensity={0.3} />
            </instancedMesh>

            {/* Central glow */}
            <pointLight position={[0, 2, 0]} color="#00aaff" intensity={2} distance={15} />
            <ambientLight intensity={0.3} />
        </group>
    )
}

// 19. Smiles Code
export const SmilesCode = () => {
    return (
        <group>
            <Text fontSize={3} position={[0, 0, 0]} color="white">
                C1=CC=CC=C1
            </Text>
            {/* Morphing to Benzene ring would require complex heavy math, keeping text for now */}
        </group>
    )
}

// 20. Collision Theory
export const CollisionTheory = ({ isPlaying }) => {
    return (
        <group>
            <mesh>
                <boxGeometry args={[10, 10, 10]} />
                <meshStandardMaterial color="white" wireframe transparent opacity={0.2} />
            </mesh>
            <InstanceParticles count={30} speed={0.5} />
        </group>
    )
}

function InstanceParticles({ count, speed }) {
    const mesh = useRef();
    const [particles] = useState(() => new Array(count).fill().map(() => ({
        pos: new THREE.Vector3(Math.random() * 9 - 4.5, Math.random() * 9 - 4.5, Math.random() * 9 - 4.5),
        vel: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(speed)
    })));

    useFrame(() => {
        particles.forEach((p, i) => {
            p.pos.add(p.vel);
            if (Math.abs(p.pos.x) > 4.5) p.vel.x *= -1;
            if (Math.abs(p.pos.y) > 4.5) p.vel.y *= -1;
            if (Math.abs(p.pos.z) > 4.5) p.vel.z *= -1;

            const dummy = new THREE.Object3D();
            dummy.position.copy(p.pos);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    })

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color="red" />
        </instancedMesh>
    )
}

// 21. Tools Augment - AI Tools Visualization
export const ToolsAugment = ({ isPlaying }) => {
    const groupRef = useRef();

    const tools = useMemo(() => [
        { name: "Retrosynthesis", icon: "⬅️", x: -3, y: 1.5, color: "#ff6666" },
        { name: "Reaction DB", icon: "🧪", x: 0, y: 2.5, color: "#44cc88" },
        { name: "Route Scorer", icon: "📊", x: 3, y: 1.5, color: "#4488ff" },
        { name: "Reagent Lookup", icon: "🔬", x: -2, y: -1, color: "#ff44aa" },
        { name: "Cost Estimator", icon: "💰", x: 2, y: -1, color: "#ffcc44" },
    ], []);

    useFrame((state) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Title */}
            <Text position={[0, 4, 0]} fontSize={0.55} color="#ffffff">
                LLM-Augmented Synthesis Planner
            </Text>
            <Text position={[0, 3.3, 0]} fontSize={0.28} color="#888888">
                AI + External Tools for Route Planning
            </Text>

            {/* Central AI Brain */}
            <mesh position={[0, 0.5, 0]}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#8844ff"
                    emissive="#4422aa"
                    emissiveIntensity={0.5}
                    wireframe
                />
            </mesh>
            <Text position={[0, 0.5, 0]} fontSize={0.4} color="#ffffff">
                AI
            </Text>

            {/* Tool nodes */}
            {tools.map((tool, i) => (
                <group key={i} position={[tool.x, tool.y, 0]}>
                    {/* Connection line to center */}
                    <SimpleLine
                        points={[[0, 0, 0], [-tool.x, 0.5 - tool.y, 0]]}
                        color={tool.color}
                    />

                    {/* Tool box */}
                    <mesh>
                        <boxGeometry args={[2.2, 0.8, 0.3]} />
                        <meshStandardMaterial
                            color={tool.color}
                            emissive={tool.color}
                            emissiveIntensity={0.3}
                        />
                    </mesh>

                    {/* Icon */}
                    <Text position={[-0.65, 0, 0.2]} fontSize={0.35}>
                        {tool.icon}
                    </Text>

                    {/* Label */}
                    <Text position={[-0.3, 0, 0.2]} fontSize={0.15} color="#ffffff" anchorX="left">
                        {tool.name}
                    </Text>
                </group>
            ))}

            {/* Data flow particles */}
            <Float speed={2} floatIntensity={0.5}>
                <mesh position={[-1.5, 1, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
                </mesh>
            </Float>
            <Float speed={2.5} floatIntensity={0.5}>
                <mesh position={[1.5, 1, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={1} />
                </mesh>
            </Float>

            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0.5, 2]} color="#8844ff" intensity={2} distance={8} />
        </group>
    )
}

// 22. Question Mark
export const QuestionMark = () => {
    const mesh = useRef();
    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
            mesh.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });
    return (
        <group ref={mesh}>
            <Text fontSize={5} color="#00ffff" anchorX="center" anchorY="middle">
                ?
            </Text>
            <Stars radius={50} count={1000} factor={4} fade speed={1} />
        </group>
    );
};

// 23. Computer Chip
export const ComputerChip = () => {
    return (
        <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <Box args={[4, 0.2, 4]}>
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
            </Box>
            {/* Pins */}
            {Array.from({ length: 10 }).map((_, i) => (
                <Box key={i} position={[-2.2, 0, (i - 4.5) * 0.4]} args={[0.4, 0.1, 0.2]}>
                    <meshStandardMaterial color="gold" metalness={1} />
                </Box>
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
                <Box key={i + 10} position={[2.2, 0, (i - 4.5) * 0.4]} args={[0.4, 0.1, 0.2]}>
                    <meshStandardMaterial color="gold" metalness={1} />
                </Box>
            ))}
            <Text position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.5} color="white">
                AI CORE
            </Text>
        </group>
    );
}

// 24. Floating Toolkit
export const FloatingToolkit = () => {
    return (
        <group>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {/* Wrench */}
                <mesh position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.5, 3, 0.2]} />
                    <meshStandardMaterial color="silver" metalness={0.9} />
                </mesh>
                {/* Flask */}
                <group position={[0, 1, 0]}>
                    <mesh position={[0, -0.5, 0]}>
                        <sphereGeometry args={[1]} />
                        <meshStandardMaterial color="cyan" transparent opacity={0.6} />
                    </mesh>
                    <mesh position={[0, 1, 0]}>
                        <cylinderGeometry args={[0.3, 0.3, 2]} />
                        <meshStandardMaterial color="white" transparent opacity={0.4} />
                    </mesh>
                </group>
                {/* Gear */}
                <mesh position={[2, 0, 0]}>
                    <torusGeometry args={[1, 0.3, 16, 100]} />
                    <meshStandardMaterial color="gold" metalness={0.8} />
                </mesh>
            </Float>
        </group>
    );
};

// ========================================
// NEW DETAILED VISUALIZATIONS
// ========================================

// 25. Neural Network Dots - Connected dots pattern
export const NeuralNetworkDots = ({ isPlaying }) => {
    const groupRef = useRef();

    // Create layers of nodes
    const layers = [4, 6, 8, 6, 4]; // Node counts per layer
    const nodes = useMemo(() => {
        const result = [];
        layers.forEach((count, layerIdx) => {
            for (let i = 0; i < count; i++) {
                const y = (i - (count - 1) / 2) * 1.2;
                const x = (layerIdx - 2) * 3;
                result.push({ x, y, z: 0, layer: layerIdx });
            }
        });
        return result;
    }, []);

    // Create connections between adjacent layers
    const connections = useMemo(() => {
        const lines = [];
        let nodeIdx = 0;
        for (let l = 0; l < layers.length - 1; l++) {
            const currentLayerStart = nodeIdx;
            const currentLayerEnd = nodeIdx + layers[l];
            const nextLayerStart = currentLayerEnd;
            const nextLayerEnd = nextLayerStart + layers[l + 1];

            for (let i = currentLayerStart; i < currentLayerEnd; i++) {
                for (let j = nextLayerStart; j < nextLayerEnd; j++) {
                    lines.push({ from: nodes[i], to: nodes[j] });
                }
            }
            nodeIdx = currentLayerEnd;
        }
        return lines;
    }, [nodes]);

    useFrame((state) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <group ref={groupRef} scale={0.8}>
            {/* Nodes */}
            {nodes.map((node, i) => (
                <mesh key={i} position={[node.x, node.y, node.z]}>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshStandardMaterial
                        color={node.layer === 0 ? "#00ff88" : node.layer === layers.length - 1 ? "#ff8800" : "#00aaff"}
                        emissive={node.layer === 0 ? "#004422" : "#001133"}
                    />
                </mesh>
            ))}
            {/* Connections */}
            {connections.map((conn, i) => (
                <SimpleLine
                    key={i}
                    points={[[conn.from.x, conn.from.y, conn.from.z], [conn.to.x, conn.to.y, conn.to.z]]}
                    color="#3366ff"
                    lineWidth={1}
                    transparent
                    opacity={0.4}
                />
            ))}
            <Text position={[0, -5, 0]} fontSize={0.8} color="white">
                Neural Network
            </Text>
        </group>
    );
};

// 26. Brain with Neurons
export const BrainNeurons = ({ isPlaying }) => {
    const brainRef = useRef();

    // Create neuron positions inside brain shape
    const neurons = useMemo(() => {
        const result = [];
        for (let i = 0; i < 50; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.5 + Math.random() * 0.5;
            result.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta) * 0.8,
                z: r * Math.cos(phi) * 0.9,
                pulse: Math.random() * Math.PI * 2
            });
        }
        return result;
    }, []);

    useFrame((state) => {
        if (brainRef.current && isPlaying) {
            brainRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <group ref={brainRef}>
            {/* Brain shape - two hemispheres */}
            <mesh position={[-0.3, 0, 0]}>
                <sphereGeometry args={[1.8, 32, 32]} />
                <meshStandardMaterial color="#ffaaaa" transparent opacity={0.3} roughness={1} />
            </mesh>
            <mesh position={[0.3, 0, 0]}>
                <sphereGeometry args={[1.8, 32, 32]} />
                <meshStandardMaterial color="#ffaaaa" transparent opacity={0.3} roughness={1} />
            </mesh>

            {/* Brain folds - wireframe overlay */}
            <mesh>
                <sphereGeometry args={[2, 16, 16]} />
                <meshStandardMaterial color="#ff6666" wireframe transparent opacity={0.5} />
            </mesh>

            {/* Neurons */}
            {neurons.map((n, i) => (
                <group key={i} position={[n.x, n.y, n.z]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 8, 8]} />
                        <meshStandardMaterial color="#ffff00" emissive="#ff8800" emissiveIntensity={0.5} />
                    </mesh>
                    {/* Dendrites */}
                    <SimpleLine
                        points={[[0, 0, 0], [Math.random() * 0.5 - 0.25, Math.random() * 0.5, Math.random() * 0.3]]}
                        color="#ffaa00"
                        lineWidth={1}
                    />
                </group>
            ))}

            <Text position={[0, -3, 0]} fontSize={0.6} color="white">
                "It's like a brain"
            </Text>
            <pointLight position={[0, 0, 0]} color="#ff8844" intensity={2} distance={5} />
        </group>
    );
};

// 27. Evolution Timeline
export const EvolutionTimeline = () => {
    const milestones = [
        { year: "1980s", label: "Rule-Based Systems", x: -6 },
        { year: "2000s", label: "Statistical ML", x: -2 },
        { year: "2012", label: "Deep Learning", x: 2 },
        { year: "2025", label: "Foundation Models", x: 6 }
    ];

    return (
        <group position={[0, 0, 0]}>
            {/* Timeline bar */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[14, 0.1, 0.1]} />
                <meshStandardMaterial color="#4488ff" emissive="#2244aa" />
            </mesh>

            {/* Milestones */}
            {milestones.map((m, i) => (
                <group key={i} position={[m.x, 0, 0]}>
                    {/* Marker */}
                    <mesh position={[0, 0.5, 0]}>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial
                            color={i === milestones.length - 1 ? "#00ff00" : "#ffffff"}
                            emissive={i === milestones.length - 1 ? "#00aa00" : "#333333"}
                        />
                    </mesh>
                    {/* Year */}
                    <Text position={[0, 1.2, 0]} fontSize={0.5} color="#00ffff" anchorX="center">
                        {m.year}
                    </Text>
                    {/* Label */}
                    <Text position={[0, -0.8, 0]} fontSize={0.3} color="white" anchorX="center" maxWidth={2}>
                        {m.label}
                    </Text>
                    {/* Connecting line */}
                    <SimpleLine points={[[0, 0, 0], [0, 0.2, 0]]} color="white" lineWidth={2} />
                </group>
            ))}

            <Text position={[0, 2.5, 0]} fontSize={0.7} color="#ffaa00">
                AI Evolution in Chemistry
            </Text>
        </group>
    );
};

// 28. Flying Letters (Language visualization)
export const FlyingLetters = ({ isPlaying }) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789CHEMISTRYAImolecule";
    const groupRef = useRef();

    const particles = useMemo(() => {
        const result = [];
        for (let i = 0; i < 40; i++) {
            result.push({
                char: letters[Math.floor(Math.random() * letters.length)],
                x: (Math.random() - 0.5) * 15,
                y: (Math.random() - 0.5) * 10,
                z: (Math.random() - 0.5) * 10,
                speed: 0.02 + Math.random() * 0.03,
                rotSpeed: (Math.random() - 0.5) * 0.02
            });
        }
        return result;
    }, []);

    useFrame(() => {
        if (!isPlaying) return;
        particles.forEach(p => {
            p.x += p.speed;
            if (p.x > 8) p.x = -8;
        });
    });

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <Float key={i} speed={2} floatIntensity={0.5}>
                    <Text
                        position={[p.x, p.y, p.z]}
                        fontSize={0.8}
                        color={i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#ff00ff" : "#ffff00"}
                    >
                        {p.char}
                    </Text>
                </Float>
            ))}
            <Text position={[0, -5, 0]} fontSize={0.6} color="white">
                Understanding Language
            </Text>
        </group>
    );
};

// 29. System Prompts Display
export const SystemPromptsDisplay = () => {
    const prompts = [
        "You are a chemist...",
        "Always conserve mass",
        "Carbon forms 4 bonds",
        "Follow valency rules"
    ];

    return (
        <group>
            {prompts.map((prompt, i) => (
                <Float key={i} speed={1.5} floatIntensity={0.3}>
                    <group position={[(i - 1.5) * 4, (i % 2) * 2 - 1, -2 + i * 0.5]}>
                        {/* Glass panel */}
                        <mesh>
                            <planeGeometry args={[4.5, 1.2]} />
                            <meshStandardMaterial
                                color="#003366"
                                transparent
                                opacity={0.6}
                                metalness={0.8}
                                roughness={0.2}
                            />
                        </mesh>
                        {/* Text */}
                        <Text position={[0, 0, 0.1]} fontSize={0.35} color="#00ffff" anchorX="center">
                            {prompt}
                        </Text>
                    </group>
                </Float>
            ))}
            <Text position={[0, -4, 0]} fontSize={0.7} color="#ffaa00">
                System Prompts
            </Text>
        </group>
    );
};

// 30. Chemistry Rules Display
export const ChemistryRulesDisplay = () => {
    return (
        <group>
            {/* Carbon with 4 bonds */}
            <group position={[-4, 1, 0]}>
                <mesh>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                <Text position={[0, 0, 0.9]} fontSize={0.5} color="white">C</Text>

                {/* 4 bonds */}
                {[[1.5, 0, 0], [-1.5, 0, 0], [0, 1.5, 0], [0, -1.5, 0]].map((pos, i) => (
                    <group key={i}>
                        <mesh position={pos}>
                            <sphereGeometry args={[0.3, 16, 16]} />
                            <meshStandardMaterial color="#ff4444" />
                        </mesh>
                        <SimpleLine points={[[0, 0, 0], pos]} color="white" lineWidth={3} />
                    </group>
                ))}
                <Text position={[0, -2.5, 0]} fontSize={0.4} color="#00ff00">
                    Carbon = 4 bonds
                </Text>
            </group>

            {/* Mass conservation */}
            <group position={[2, 2, 0]}>
                <Text fontSize={0.6} color="#ffff00" anchorX="center">
                    CONSERVE MASS
                </Text>
            </group>

            {/* Energy law */}
            <group position={[2, -1, 0]}>
                <Text fontSize={0.4} color="#ff8800" anchorX="center" maxWidth={6}>
                    "Energy cannot be created nor destroyed"
                </Text>
            </group>
        </group>
    );
};

// 31. Synthesis Roadmap (LLM-Augmented)
export const SynthesisRoadmap = ({ isPlaying }) => {
    const compounds = [
        { label: "A", x: -6, y: 0, color: "#ff4444" },
        { label: "B", x: -2, y: 2, color: "#44ff44" },
        { label: "C", x: -2, y: -2, color: "#4444ff" },
        { label: "D", x: 2, y: 0, color: "#ffff44" },
        { label: "TARGET", x: 6, y: 0, color: "#ff00ff" }
    ];

    const arrows = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 3, to: 4 }
    ];

    return (
        <group>
            {/* Compounds */}
            {compounds.map((c, i) => (
                <group key={i} position={[c.x, c.y, 0]}>
                    <mesh>
                        <dodecahedronGeometry args={[0.8]} />
                        <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.3} />
                    </mesh>
                    <Text position={[0, 1.3, 0]} fontSize={0.5} color="white">
                        {c.label}
                    </Text>
                </group>
            ))}

            {/* Arrows */}
            {arrows.map((a, i) => {
                const from = compounds[a.from];
                const to = compounds[a.to];
                return (
                    <SimpleLine
                        key={i}
                        points={[[from.x, from.y, 0], [to.x, to.y, 0]]}
                        color="#00ffff"
                        lineWidth={2}
                    />
                );
            })}

            <Text position={[0, -4, 0]} fontSize={0.6} color="#ffaa00">
                Synthesis Roadmap
            </Text>
        </group>
    );
};

// 32. Big Numbers Display
export const BigNumbersDisplay = () => {
    return (
        <group>
            {/* 34 Billion */}
            <group position={[0, 3, 0]}>
                <Text fontSize={2} color="#00ffff" anchorX="center">
                    34 BILLION
                </Text>
                <Text position={[0, -1, 0]} fontSize={0.5} color="white" anchorX="center">
                    tokens
                </Text>
            </group>

            {/* 3.8 Million */}
            <group position={[-4, -1, 0]}>
                <Text fontSize={1.2} color="#ff8800" anchorX="center">
                    3.8 MILLION
                </Text>
                <Text position={[0, -0.8, 0]} fontSize={0.4} color="white" anchorX="center">
                    chemistry papers
                </Text>
                {/* Stack of papers visualization */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <mesh key={i} position={[0, -1.5 - i * 0.1, 0]}>
                        <boxGeometry args={[2, 0.05, 1.5]} />
                        <meshStandardMaterial color="#ffffee" />
                    </mesh>
                ))}
            </group>

            {/* 1,400 Textbooks */}
            <group position={[4, -1, 0]}>
                <Text fontSize={1.2} color="#44ff44" anchorX="center">
                    1,400
                </Text>
                <Text position={[0, -0.8, 0]} fontSize={0.4} color="white" anchorX="center">
                    textbooks
                </Text>
                {/* Book stack */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <mesh key={i} position={[0, -1.5 - i * 0.3, 0]}>
                        <boxGeometry args={[1.2, 0.25, 0.8]} />
                        <meshStandardMaterial color={`hsl(${i * 40}, 70%, 50%)`} />
                    </mesh>
                ))}
            </group>
        </group>
    );
};

// 33. Protein Structure (AlphaFold)
export const ProteinStructure = ({ isPlaying }) => {
    const proteinRef = useRef();

    // Create helix points
    const helixPoints = useMemo(() => {
        const points = [];
        for (let i = 0; i < 100; i++) {
            const t = i * 0.15;
            points.push([
                Math.cos(t) * 1.5,
                t * 0.3 - 2,
                Math.sin(t) * 1.5
            ]);
        }
        return points;
    }, []);

    useFrame((state) => {
        if (proteinRef.current && isPlaying) {
            proteinRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <group ref={proteinRef}>
            {/* Alpha helix backbone */}
            <SimpleLine
                points={helixPoints}
                color="#ff4488"
                lineWidth={4}
            />

            {/* Amino acid residues */}
            {helixPoints.filter((_, i) => i % 5 === 0).map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial
                        color={i % 3 === 0 ? "#ff0000" : i % 3 === 1 ? "#00ff00" : "#0000ff"}
                    />
                </mesh>
            ))}

            {/* Beta sheet representation */}
            <mesh position={[3, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
                <planeGeometry args={[2, 4]} />
                <meshStandardMaterial color="#ffaa00" side={2} transparent opacity={0.7} />
            </mesh>

            <Text position={[0, -5, 0]} fontSize={0.6} color="#00ffff">
                AlphaFold - Protein Structure
            </Text>
        </group>
    );
};

// 34. Protein Interaction (ChemDFM + AlphaFold)
export const ProteinInteraction = ({ isPlaying }) => {
    const groupRef = useRef();
    const [offset, setOffset] = useState(3);

    useFrame((state) => {
        if (isPlaying) {
            const newOffset = Math.max(0.5, 3 - state.clock.elapsedTime * 0.3);
            setOffset(newOffset);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Protein (left) */}
            <group position={[-offset, 0, 0]}>
                <mesh>
                    <icosahedronGeometry args={[1.5, 1]} />
                    <meshStandardMaterial color="#ff6688" transparent opacity={0.8} />
                </mesh>
                <Text position={[0, 2.2, 0]} fontSize={0.4} color="white">
                    AlphaFold
                </Text>
            </group>

            {/* Small molecule (right) */}
            <group position={[offset, 0, 0]}>
                <mesh>
                    <dodecahedronGeometry args={[0.8]} />
                    <meshStandardMaterial color="#66ff88" emissive="#228844" />
                </mesh>
                <Text position={[0, 1.5, 0]} fontSize={0.4} color="white">
                    ChemDFM
                </Text>
            </group>

            {/* Binding glow when close */}
            {offset < 1.5 && (
                <pointLight position={[0, 0, 0]} color="#ffff00" intensity={3} distance={5} />
            )}

            <Text position={[0, -3, 0]} fontSize={0.5} color="#ffaa00">
                Complementary Interaction
            </Text>
        </group>
    );
};

// 35. Retrosynthesis Backwards
export const RetrosynthesisBackwards = ({ isPlaying }) => {
    const steps = [
        { label: "Complex\nTarget", x: 0, size: 1.5, color: "#ff00ff" },
        { label: "Step 3", x: -3, y: 2, size: 0.8, color: "#ff8800" },
        { label: "Step 3", x: -3, y: -2, size: 0.8, color: "#ff8800" },
        { label: "Step 2", x: -6, y: 3, size: 0.6, color: "#ffff00" },
        { label: "Step 2", x: -6, y: 1, size: 0.6, color: "#ffff00" },
        { label: "Step 2", x: -6, y: -1, size: 0.6, color: "#ffff00" },
        { label: "Step 2", x: -6, y: -3, size: 0.6, color: "#ffff00" },
        { label: "Starting\nMaterial", x: -9, y: 0, size: 0.5, color: "#00ff00" }
    ];

    return (
        <group>
            {/* Central target */}
            <group position={[0, 0, 0]}>
                <mesh>
                    <icosahedronGeometry args={[1.5, 2]} />
                    <meshStandardMaterial color="#ff00ff" emissive="#880088" />
                </mesh>
                <Text position={[0, 2.5, 0]} fontSize={0.5} color="white" anchorX="center">
                    Complex Target
                </Text>
            </group>

            {/* Backwards arrows (pointing inward) */}
            <SimpleLine points={[[-2.5, 1.5, 0], [-0.5, 0.3, 0]]} color="#00ffff" lineWidth={3} />
            <SimpleLine points={[[-2.5, -1.5, 0], [-0.5, -0.3, 0]]} color="#00ffff" lineWidth={3} />

            {/* Intermediate compounds */}
            {[1, 2].map((_, i) => (
                <group key={i} position={[-3, i === 0 ? 2 : -2, 0]}>
                    <mesh>
                        <dodecahedronGeometry args={[0.8]} />
                        <meshStandardMaterial color="#ff8800" />
                    </mesh>
                </group>
            ))}

            {/* More arrows */}
            <SimpleLine points={[[-5, 2.5, 0], [-3.5, 2.2, 0]]} color="#00ffff" lineWidth={2} />
            <SimpleLine points={[[-5, 1, 0], [-3.5, 1.8, 0]]} color="#00ffff" lineWidth={2} />
            <SimpleLine points={[[-5, -1, 0], [-3.5, -1.8, 0]]} color="#00ffff" lineWidth={2} />
            <SimpleLine points={[[-5, -2.5, 0], [-3.5, -2.2, 0]]} color="#00ffff" lineWidth={2} />

            {/* Simple starting materials */}
            {[-2.5, -0.8, 0.8, 2.5].map((y, i) => (
                <group key={i} position={[-6, y, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.4, 16, 16]} />
                        <meshStandardMaterial color="#00ff00" />
                    </mesh>
                </group>
            ))}

            <Text position={[-6, -4, 0]} fontSize={0.4} color="#00ff00" anchorX="center">
                Starting Materials
            </Text>

            <Text position={[0, -4, 0]} fontSize={0.6} color="#ffaa00" anchorX="center">
                Retrosynthesis: Working BACKWARDS
            </Text>
        </group>
    );
};

// 36. Collision Simulation with Temperature Slider
export const CollisionSimulation = ({ isPlaying, temperature = 50 }) => {
    const [atoms, setAtoms] = useState(() => {
        const result = [];
        for (let i = 0; i < 30; i++) {
            result.push({
                x: (Math.random() - 0.5) * 6,
                y: (Math.random() - 0.5) * 4,
                z: 0,
                vx: (Math.random() - 0.5) * 0.05,
                vy: (Math.random() - 0.5) * 0.05,
                color: "#4488ff"
            });
        }
        return result;
    });

    useFrame(() => {
        if (!isPlaying) return;

        setAtoms(prevAtoms => {
            return prevAtoms.map(atom => {
                const speed = temperature / 25; // Scale speed with temperature
                let newX = atom.x + atom.vx * speed;
                let newY = atom.y + atom.vy * speed;
                let newVx = atom.vx;
                let newVy = atom.vy;

                // Bounce off walls
                if (Math.abs(newX) > 3.5) {
                    newVx *= -1;
                    newX = Math.sign(newX) * 3.5;
                }
                if (Math.abs(newY) > 2.5) {
                    newVy *= -1;
                    newY = Math.sign(newY) * 2.5;
                }

                // Color based on temperature
                const color = temperature > 70 ? "#ff4444" : temperature > 40 ? "#ffaa44" : "#4488ff";

                return { ...atom, x: newX, y: newY, vx: newVx, vy: newVy, color };
            });
        });
    });

    return (
        <group>
            {/* Glass container */}
            <mesh>
                <boxGeometry args={[8, 6, 0.5]} />
                <meshStandardMaterial color="#aaddff" transparent opacity={0.15} />
            </mesh>
            <mesh>
                <boxGeometry args={[8.1, 6.1, 0.1]} />
                <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.3} />
            </mesh>

            {/* Atoms */}
            {atoms.map((atom, i) => (
                <mesh key={i} position={[atom.x, atom.y, atom.z]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial
                        color={atom.color}
                        emissive={atom.color}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            ))}

            {/* Title */}
            <Text position={[0, 4.2, 0]} fontSize={0.5} color="#ffffff">
                Collision Theory Simulation
            </Text>
            <Text position={[0, 3.6, 0]} fontSize={0.28} color="#888888">
                Drag slider to change temperature
            </Text>

            {/* Temperature indicator */}
            <Text position={[0, -3.8, 0]} fontSize={0.4} color={temperature > 70 ? "#ff4444" : temperature > 40 ? "#ffaa44" : "#4488ff"}>
                🌡️ Temperature: {temperature}°
            </Text>

            {/* Slider bar (visual representation) */}
            <group position={[0, -4.5, 0]}>
                {/* Track */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[5, 0.15, 0.1]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                {/* Filled portion */}
                <mesh position={[(temperature / 100 - 0.5) * 2.5, 0, 0.05]}>
                    <boxGeometry args={[temperature / 100 * 5, 0.15, 0.1]} />
                    <meshStandardMaterial color={temperature > 70 ? "#ff4444" : temperature > 40 ? "#ffaa44" : "#4488ff"} />
                </mesh>
                {/* Knob */}
                <mesh position={[(temperature / 100 - 0.5) * 5, 0, 0.1]}>
                    <sphereGeometry args={[0.2]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
                </mesh>
            </group>

            <ambientLight intensity={0.4} />
            <pointLight position={[0, 0, 5]} intensity={1} />
        </group>
    );
};

// Temperature slider overlay component - rendered in HTML
export const CollisionSimulationWithSlider = ({ isPlaying }) => {
    const [temperature, setTemperature] = useState(50);

    return (
        <>
            <CollisionSimulationInner isPlaying={isPlaying} temperature={temperature} />
            {/* HTML Slider overlay */}
            <div style={{
                position: 'absolute',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                background: 'rgba(0,0,0,0.6)',
                padding: '12px 25px',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)'
            }}>
                <span style={{ color: '#4488ff', fontSize: '14px' }}>❄️ Cold</span>
                <input
                    type="range"
                    min="10"
                    max="100"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    style={{
                        width: '200px',
                        accentColor: temperature > 70 ? '#ff4444' : temperature > 40 ? '#ffaa44' : '#4488ff'
                    }}
                />
                <span style={{ color: '#ff4444', fontSize: '14px' }}>🔥 Hot</span>
            </div>
        </>
    );
};

// Inner component that receives temperature
const CollisionSimulationInner = ({ isPlaying, temperature }) => {
    const [atoms, setAtoms] = useState(() => {
        const result = [];
        for (let i = 0; i < 30; i++) {
            result.push({
                x: (Math.random() - 0.5) * 6,
                y: (Math.random() - 0.5) * 4,
                vx: (Math.random() - 0.5) * 0.05,
                vy: (Math.random() - 0.5) * 0.05,
            });
        }
        return result;
    });

    useFrame(() => {
        if (!isPlaying) return;

        setAtoms(prev => prev.map(atom => {
            const speed = temperature / 25;
            let newX = atom.x + atom.vx * speed;
            let newY = atom.y + atom.vy * speed;
            let newVx = atom.vx;
            let newVy = atom.vy;

            if (Math.abs(newX) > 3.5) { newVx *= -1; newX = Math.sign(newX) * 3.5; }
            if (Math.abs(newY) > 2.5) { newVy *= -1; newY = Math.sign(newY) * 2.5; }

            return { ...atom, x: newX, y: newY, vx: newVx, vy: newVy };
        }));
    });

    const atomColor = temperature > 70 ? "#ff4444" : temperature > 40 ? "#ffaa44" : "#4488ff";

    return (
        <group>
            <mesh><boxGeometry args={[8, 6, 0.5]} /><meshStandardMaterial color="#aaddff" transparent opacity={0.15} /></mesh>
            {atoms.map((atom, i) => (
                <mesh key={i} position={[atom.x, atom.y, 0]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color={atomColor} emissive={atomColor} emissiveIntensity={0.5} />
                </mesh>
            ))}
            <Text position={[0, 4, 0]} fontSize={0.5} color="#fff">Collision Theory</Text>
            <Text position={[0, -3.5, 0]} fontSize={0.35} color={atomColor}>Temperature: {temperature}°</Text>
        </group>
    );
};

// ========================================
// CHEMDFM MOLECULAR STRUCTURE
// ========================================
export const ChemDFMMolecule = ({ isPlaying }) => {
    const groupRef = useRef();

    // Define a benzene-like molecular structure
    const atoms = useMemo(() => [
        { pos: [0, 0, 0], element: 'C', color: '#333333' },
        { pos: [1.4, 0, 0], element: 'C', color: '#333333' },
        { pos: [2.1, 1.2, 0], element: 'C', color: '#333333' },
        { pos: [1.4, 2.4, 0], element: 'C', color: '#333333' },
        { pos: [0, 2.4, 0], element: 'C', color: '#333333' },
        { pos: [-0.7, 1.2, 0], element: 'C', color: '#333333' },
        // Hydrogens
        { pos: [-0.7, -0.7, 0], element: 'H', color: '#ffffff', small: true },
        { pos: [2.1, -0.7, 0], element: 'H', color: '#ffffff', small: true },
        { pos: [3.1, 1.2, 0], element: 'H', color: '#ffffff', small: true },
        { pos: [2.1, 3.1, 0], element: 'H', color: '#ffffff', small: true },
        { pos: [-0.7, 3.1, 0], element: 'H', color: '#ffffff', small: true },
        { pos: [-1.7, 1.2, 0], element: 'H', color: '#ffffff', small: true },
    ], []);

    const bonds = useMemo(() => [
        [[0, 0, 0], [1.4, 0, 0]],
        [[1.4, 0, 0], [2.1, 1.2, 0]],
        [[2.1, 1.2, 0], [1.4, 2.4, 0]],
        [[1.4, 2.4, 0], [0, 2.4, 0]],
        [[0, 2.4, 0], [-0.7, 1.2, 0]],
        [[-0.7, 1.2, 0], [0, 0, 0]],
    ], []);

    useFrame((state) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Atoms */}
            {atoms.map((atom, i) => (
                <mesh key={i} position={atom.pos}>
                    <sphereGeometry args={[atom.small ? 0.2 : 0.4, 16, 16]} />
                    <meshStandardMaterial
                        color={atom.color}
                        emissive={atom.color}
                        emissiveIntensity={0.3}
                    />
                </mesh>
            ))}

            {/* Bonds */}
            {bonds.map((bond, i) => (
                <SimpleLine key={i} points={bond} color="#666666" lineWidth={2} />
            ))}

            {/* Analysis scanning effect */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.5, 2.8, 32]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.3} side={2} />
            </mesh>

            {/* ChemDFM label */}
            <Text position={[0, -2, 0]} fontSize={0.5} color="#00ffff">
                ChemDFM Analyzing...
            </Text>
            <Text position={[0, -2.8, 0]} fontSize={0.3} color="#888888">
                C₆H₆ - Benzene
            </Text>

            <pointLight position={[0, 1.2, 2]} color="#00ffff" intensity={2} distance={5} />
        </group>
    );
};

// ========================================
// SCALE PYRAMID COMPARISON (13B vs 1T vs 3T)
// ========================================
export const ScalePyramidComparison = ({ isPlaying }) => {
    const groupRef = useRef();

    // Create pyramid of cubes
    const createPyramid = (baseSize, height, color) => {
        const cubes = [];
        for (let level = 0; level < height; level++) {
            const levelSize = baseSize - level;
            for (let x = 0; x < levelSize; x++) {
                for (let z = 0; z < levelSize; z++) {
                    cubes.push({
                        pos: [
                            (x - (levelSize - 1) / 2) * 0.5,
                            level * 0.5,
                            (z - (levelSize - 1) / 2) * 0.5
                        ],
                        color
                    });
                }
            }
        }
        return cubes;
    };

    // 13B: Small pyramid (represents 13 billion)
    const pyramid13B = useMemo(() => createPyramid(3, 3, '#4488ff'), []);
    // 1T: Medium pyramid (represents 1 trillion = ~77x more)
    const pyramid1T = useMemo(() => createPyramid(5, 4, '#44ff88'), []);
    // 3T: Large pyramid (represents 3 trillion = ~231x more)
    const pyramid3T = useMemo(() => createPyramid(7, 5, '#ff8844'), []);

    useFrame((state) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            {/* 13 Billion - Small */}
            <group position={[-6, -2, 0]}>
                {pyramid13B.map((cube, i) => (
                    <mesh key={i} position={cube.pos}>
                        <boxGeometry args={[0.45, 0.45, 0.45]} />
                        <meshStandardMaterial color={cube.color} />
                    </mesh>
                ))}
                <Text position={[0, 2, 0]} fontSize={0.6} color="#4488ff">
                    13B
                </Text>
                <Text position={[0, 1.4, 0]} fontSize={0.3} color="#888888">
                    ChemDFM
                </Text>
            </group>

            {/* 1 Trillion - Medium */}
            <group position={[0, -2, 0]}>
                {pyramid1T.map((cube, i) => (
                    <mesh key={i} position={cube.pos}>
                        <boxGeometry args={[0.45, 0.45, 0.45]} />
                        <meshStandardMaterial color={cube.color} />
                    </mesh>
                ))}
                <Text position={[0, 2.5, 0]} fontSize={0.6} color="#44ff88">
                    1 TRILLION
                </Text>
                <Text position={[0, 1.9, 0]} fontSize={0.3} color="#888888">
                    GPT-4 Training
                </Text>
            </group>

            {/* 3 Trillion - Large */}
            <group position={[6, -2, 0]}>
                {pyramid3T.map((cube, i) => (
                    <mesh key={i} position={cube.pos}>
                        <boxGeometry args={[0.45, 0.45, 0.45]} />
                        <meshStandardMaterial color={cube.color} />
                    </mesh>
                ))}
                <Text position={[0, 3, 0]} fontSize={0.6} color="#ff8844">
                    3 TRILLION
                </Text>
                <Text position={[0, 2.4, 0]} fontSize={0.3} color="#888888">
                    Llama 3
                </Text>
            </group>

            {/* Title */}
            <Text position={[0, 4, 0]} fontSize={0.7} color="#ffffff">
                Parameter Scale Comparison
            </Text>
            <Text position={[0, 3.3, 0]} fontSize={0.35} color="#aaaaaa">
                Each cube = billions of parameters
            </Text>
        </group>
    );
};

// Graph Neural Network Visualization
export const GraphNeuralNetwork = ({ isPlaying }) => {
    const groupRef = useRef();

    // Molecular graph nodes (like benzene ring with connections)
    const nodes = useMemo(() => [
        { id: 0, pos: [0, 2, 0], color: '#ff6b6b', label: 'C' },
        { id: 1, pos: [1.7, 1, 0], color: '#ff6b6b', label: 'C' },
        { id: 2, pos: [1.7, -1, 0], color: '#ff6b6b', label: 'C' },
        { id: 3, pos: [0, -2, 0], color: '#ff6b6b', label: 'C' },
        { id: 4, pos: [-1.7, -1, 0], color: '#ff6b6b', label: 'C' },
        { id: 5, pos: [-1.7, 1, 0], color: '#ff6b6b', label: 'C' },
        // Hydrogen atoms
        { id: 6, pos: [0, 3.2, 0], color: '#4ecdc4', label: 'H' },
        { id: 7, pos: [2.8, 1.6, 0], color: '#4ecdc4', label: 'H' },
        { id: 8, pos: [2.8, -1.6, 0], color: '#4ecdc4', label: 'H' },
        { id: 9, pos: [0, -3.2, 0], color: '#4ecdc4', label: 'H' },
        { id: 10, pos: [-2.8, -1.6, 0], color: '#4ecdc4', label: 'H' },
        { id: 11, pos: [-2.8, 1.6, 0], color: '#4ecdc4', label: 'H' },
    ], []);

    // Edges connecting nodes
    const edges = useMemo(() => [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], // Ring
        [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11], // H bonds
    ], []);

    // Message passing animation
    const [messagePos, setMessagePos] = useState(0);

    useFrame((state) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y += 0.003;
        }
        if (isPlaying) {
            setMessagePos((prev) => (prev + 0.02) % 1);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Title */}
            <Text position={[0, 4.5, 0]} fontSize={0.6} color="#ffffff">
                Graph Neural Network
            </Text>
            <Text position={[0, 3.8, 0]} fontSize={0.3} color="#888888">
                Message Passing Between Atoms
            </Text>

            {/* Draw edges */}
            {edges.map(([from, to], i) => (
                <SimpleLine
                    key={`edge-${i}`}
                    points={[nodes[from].pos, nodes[to].pos]}
                    color="#666688"
                    lineWidth={2}
                />
            ))}

            {/* Draw nodes */}
            {nodes.map((node) => (
                <group key={node.id} position={node.pos}>
                    <Sphere args={[node.label === 'C' ? 0.4 : 0.25]}>
                        <meshStandardMaterial
                            color={node.color}
                            emissive={node.color}
                            emissiveIntensity={0.3}
                        />
                    </Sphere>
                    <Text position={[0, 0, 0.5]} fontSize={0.25} color="#ffffff">
                        {node.label}
                    </Text>
                </group>
            ))}

            {/* Message passing - glowing orbs along edges */}
            {edges.slice(0, 6).map((edge, i) => {
                const from = nodes[edge[0]].pos;
                const to = nodes[edge[1]].pos;
                const offset = (messagePos + i * 0.15) % 1;
                const x = from[0] + (to[0] - from[0]) * offset;
                const y = from[1] + (to[1] - from[1]) * offset;
                const z = from[2] + (to[2] - from[2]) * offset;

                return (
                    <mesh key={`msg-${i}`} position={[x, y, z]}>
                        <sphereGeometry args={[0.12]} />
                        <meshStandardMaterial
                            color="#00ffff"
                            emissive="#00ffff"
                            emissiveIntensity={1}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                );
            })}

            {/* Legend */}
            <group position={[4, 0, 0]}>
                <Sphere args={[0.2]} position={[0, 1, 0]}>
                    <meshStandardMaterial color="#ff6b6b" />
                </Sphere>
                <Text position={[0.6, 1, 0]} fontSize={0.2} color="#aaaaaa" anchorX="left">
                    Carbon
                </Text>
                <Sphere args={[0.15]} position={[0, 0.4, 0]}>
                    <meshStandardMaterial color="#4ecdc4" />
                </Sphere>
                <Text position={[0.6, 0.4, 0]} fontSize={0.2} color="#aaaaaa" anchorX="left">
                    Hydrogen
                </Text>
                <mesh position={[0, -0.2, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
                </mesh>
                <Text position={[0.6, -0.2, 0]} fontSize={0.2} color="#aaaaaa" anchorX="left">
                    Message
                </Text>
            </group>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </group>
    );
};

// AI Model Performance Evolution Timeline
export const AIEvolutionChart = ({ isPlaying }) => {
    const groupRef = useRef();
    const [hoveredMilestone, setHoveredMilestone] = useState(null);

    // Timeline milestones
    const milestones = useMemo(() => [
        { year: 1985, label: "Rule-Based", perf: 0.2, color: "#ff6666", desc: "Expert Systems" },
        { year: 1995, label: "Statistical ML", perf: 0.35, color: "#ff9944", desc: "Pattern Learning" },
        { year: 2005, label: "Kernel Methods", perf: 0.5, color: "#ffcc44", desc: "SVM for Chemistry" },
        { year: 2012, label: "Deep Learning", perf: 0.7, color: "#88cc44", desc: "Neural Networks" },
        { year: 2018, label: "Transformers", perf: 0.85, color: "#44cc88", desc: "BERT, Attention" },
        { year: 2021, label: "AlphaFold", perf: 0.95, color: "#44ccff", desc: "Protein revolution" },
        { year: 2024, label: "ChemDFM", perf: 1.0, color: "#aa66ff", desc: "Foundation Models" },
    ], []);

    useFrame((state) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    const xStart = -7;
    const xStep = 2.3;

    return (
        <group ref={groupRef}>
            {/* Title */}
            <Text position={[0, 4.5, 0]} fontSize={0.6} color="#ffffff">
                AI Model Performance Evolution
            </Text>
            <Text position={[0, 3.8, 0]} fontSize={0.3} color="#888888">
                From Rule-Based Systems to Foundation Models
            </Text>

            {/* X-Axis */}
            <SimpleLine
                points={[[xStart - 0.5, -2.5, 0], [xStart + milestones.length * xStep, -2.5, 0]]}
                color="#666666"
            />
            <Text position={[xStart + 7, -3.2, 0]} fontSize={0.25} color="#888888">
                Year
            </Text>

            {/* Y-Axis */}
            <SimpleLine
                points={[[xStart - 0.5, -2.5, 0], [xStart - 0.5, 3, 0]]}
                color="#666666"
            />
            <Text position={[xStart - 1.5, 0.5, 0]} fontSize={0.25} color="#888888" rotation={[0, 0, Math.PI / 2]}>
                Performance
            </Text>

            {/* Performance bars and labels */}
            {milestones.map((m, i) => {
                const x = xStart + i * xStep;
                const height = m.perf * 4;

                return (
                    <group key={m.year} position={[x, 0, 0]}>
                        {/* Bar */}
                        <mesh position={[0, height / 2 - 2.5, 0]}>
                            <boxGeometry args={[0.8, height, 0.8]} />
                            <meshStandardMaterial
                                color={m.color}
                                emissive={m.color}
                                emissiveIntensity={0.3}
                            />
                        </mesh>

                        {/* Cap sphere */}
                        <mesh position={[0, height - 2.5, 0]}>
                            <sphereGeometry args={[0.25]} />
                            <meshStandardMaterial
                                color={m.color}
                                emissive={m.color}
                                emissiveIntensity={0.5}
                            />
                        </mesh>

                        {/* Year label */}
                        <Text position={[0, -3, 0]} fontSize={0.22} color="#aaaaaa">
                            {m.year}
                        </Text>

                        {/* Model name */}
                        <Text
                            position={[0, height - 2, 0]}
                            fontSize={0.2}
                            color="#ffffff"
                            rotation={[0, 0, 0.3]}
                        >
                            {m.label}
                        </Text>

                        {/* Description */}
                        <Text position={[0, height - 1.5, 0]} fontSize={0.15} color="#888888">
                            {m.desc}
                        </Text>
                    </group>
                );
            })}

            {/* Trend line connecting all milestones */}
            <SimpleLine
                points={milestones.map((m, i) => [xStart + i * xStep, m.perf * 4 - 2.5, 0.5])}
                color="#ffffff"
                lineWidth={2}
            />

            {/* Legend */}
            <group position={[6, -1.5, 0]}>
                <Text position={[0, 0.5, 0]} fontSize={0.2} color="#44ccff" anchorX="left">
                    ↑ Higher = Better accuracy
                </Text>
                <Text position={[0, 0, 0]} fontSize={0.18} color="#888888" anchorX="left">
                    Chart shows relative performance
                </Text>
            </group>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </group>
    );
};
