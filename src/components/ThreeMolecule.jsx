import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const Atom = ({ position, color, size }) => {
    return (
        <mesh position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
                color={color}
                roughness={0.1}
                metalness={0.5}
                emissive={color}
                emissiveIntensity={0.2}
            />
        </mesh>
    );
};

const Bond = ({ start, end }) => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();

    // Calculate position (midpoint)
    const position = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);

    // Calculate rotation
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    const rotation = new THREE.Euler().setFromQuaternion(quaternion);

    return (
        <mesh position={position} rotation={rotation}>
            <cylinderGeometry args={[0.08, 0.08, length, 12]} />
            <meshStandardMaterial color="#888" opacity={0.5} transparent />
        </mesh>
    );
};

const MoleculeModel = ({ autoRotate }) => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (autoRotate && groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
            groupRef.current.rotation.x += delta * 0.05;
        }
    });

    // Define a pseudo-Caffeine structure (simplified for impactful visual)
    const atoms = useMemo(() => [
        // Ring 1
        { pos: [0, 0, 0], color: "#4285F4", size: 0.4 }, // N
        { pos: [1, 0.5, 0], color: "#34A853", size: 0.4 }, // C
        { pos: [1.8, -0.2, 0], color: "#4285F4", size: 0.4 }, // N
        { pos: [1.2, -1.2, 0], color: "#34A853", size: 0.4 }, // C
        { pos: [0.2, -1, 0], color: "#34A853", size: 0.4 }, // C

        // Ring 2 (attached)
        { pos: [-0.5, 1, 0], color: "#34A853", size: 0.4 }, // C
        { pos: [-1.5, 0.5, 0], color: "#4285F4", size: 0.4 }, // N
        { pos: [-1.2, -0.5, 0], color: "#34A853", size: 0.4 }, // C

        // Oxygens (Double bonds simulated by position)
        { pos: [-2.2, -1, 0], color: "#EA4335", size: 0.35 }, // O
        { pos: [2.5, 1, 0.5], color: "#EA4335", size: 0.35 }, // O

        // Methyl groups (CH3) - simplistic representation
        { pos: [2.8, -0.5, 0], color: "#999", size: 0.3 },
        { pos: [-0.2, 2, 0.5], color: "#999", size: 0.3 },
        { pos: [-2.5, 1, -0.5], color: "#999", size: 0.3 },
    ], []);

    const bonds = useMemo(() => [
        { start: [0, 0, 0], end: [1, 0.5, 0] },
        { start: [1, 0.5, 0], end: [1.8, -0.2, 0] },
        { start: [1.8, -0.2, 0], end: [1.2, -1.2, 0] },
        { start: [1.2, -1.2, 0], end: [0.2, -1, 0] },
        { start: [0.2, -1, 0], end: [0, 0, 0] },

        { start: [0, 0, 0], end: [-0.5, 1, 0] },
        { start: [-0.5, 1, 0], end: [-1.5, 0.5, 0] },
        { start: [-1.5, 0.5, 0], end: [-1.2, -0.5, 0] },
        { start: [-1.2, -0.5, 0], end: [0.2, -1, 0] },

        { start: [-1.2, -0.5, 0], end: [-2.2, -1, 0] },
        { start: [1, 0.5, 0], end: [2.5, 1, 0.5] },

        { start: [1.8, -0.2, 0], end: [2.8, -0.5, 0] },
        { start: [-0.5, 1, 0], end: [-0.2, 2, 0.5] },
        { start: [-1.5, 0.5, 0], end: [-2.5, 1, -0.5] },
    ], []);

    return (
        <group ref={groupRef}>
            {atoms.map((atom, i) => (
                <Atom key={i} position={atom.pos} color={atom.color} size={atom.size} />
            ))}
            {bonds.map((bond, i) => (
                <Bond key={i} start={bond.start} end={bond.end} />
            ))}
        </group>
    );
};

const ThreeMolecule = ({ type = 'molecule3d' }) => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4285F4" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <MoleculeModel autoRotate={true} />
                </Float>

                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
            </Canvas>
        </div>
    );
};

export default ThreeMolecule;
