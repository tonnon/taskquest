import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, BufferGeometry, Float32BufferAttribute, Color, Points } from 'three';
import * as THREE from 'three';
import { BadgeTierConfig } from '@/utils/badgeTiers';

interface Badge3DModelProps {
    config: BadgeTierConfig;
    level: number;
}

export const Badge3DModel = ({ config, level }: Badge3DModelProps) => {
    const badgeRef = useRef<Mesh>(null);
    const particlesRef = useRef<Points>(null);
    const glowRef = useRef<Mesh>(null);

    // Animação de rotação
    useFrame((state) => {
        if (badgeRef.current) {
            badgeRef.current.rotation.z += 0.005;
        }

        if (particlesRef.current && config.particles.count > 0) {
            particlesRef.current.rotation.z -= config.particles.speed * 0.01;
            particlesRef.current.rotation.y += config.particles.speed * 0.005;
        }

        if (glowRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
            glowRef.current.scale.setScalar(1 + pulse * 0.1);
        }
    });

    // Cria a geometria do badge com spikes em formato de anel
    const createBadgeGeometry = () => {
        const geometry = new BufferGeometry();
        const { spikes, innerRadius, outerRadius, depth } = config.geometry;

        const vertices: number[] = [];
        const indices: number[] = [];
        const colors: number[] = [];

        const primaryColor = new Color(config.colors.primary);
        const secondaryColor = new Color(config.colors.secondary);
        const accentColor = new Color(config.colors.accent);

        const segments = 64; // Resolução do anel circular

        // Cria o anel base (torus/donut shape)
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // Vértice interno do anel
            vertices.push(
                cos * innerRadius,
                sin * innerRadius,
                0
            );
            colors.push(secondaryColor.r, secondaryColor.g, secondaryColor.b);

            // Vértice externo do anel (entre spikes)
            const midRadius = innerRadius + (outerRadius - innerRadius) * 0.6;
            vertices.push(
                cos * midRadius,
                sin * midRadius,
                depth * 0.3
            );
            colors.push(accentColor.r, accentColor.g, accentColor.b);
        }

        // Cria triângulos para o anel base
        for (let i = 0; i < segments; i++) {
            const a = i * 2;
            const b = a + 1;
            const c = a + 2;
            const d = a + 3;

            indices.push(a, b, c);
            indices.push(b, d, c);
        }

        // Adiciona os spikes (pontas decorativas)
        const baseVertexCount = vertices.length / 3;

        for (let i = 0; i < spikes; i++) {
            const angle = (i / spikes) * Math.PI * 2;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // Ponto de ancoragem no anel
            const anchorRadius = innerRadius + (outerRadius - innerRadius) * 0.6;
            const anchorIdx = baseVertexCount + i * 3;

            vertices.push(cos * anchorRadius, sin * anchorRadius, depth * 0.3);
            colors.push(accentColor.r, accentColor.g, accentColor.b);

            // Ponta do spike
            vertices.push(cos * outerRadius, sin * outerRadius, depth);
            colors.push(primaryColor.r, primaryColor.g, primaryColor.b);

            // Ponto intermediário para suavizar
            const midAngle = angle + (Math.PI / spikes) * 0.5;
            const midCos = Math.cos(midAngle);
            const midSin = Math.sin(midAngle);
            vertices.push(midCos * anchorRadius, midSin * anchorRadius, depth * 0.3);
            colors.push(secondaryColor.r, secondaryColor.g, secondaryColor.b);
        }

        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    };

    // Cria sistema de partículas
    const createParticles = () => {
        if (config.particles.count === 0) return null;

        const geometry = new BufferGeometry();
        const positions: number[] = [];
        const colors: number[] = [];

        const color = new Color(config.colors.accent);

        for (let i = 0; i < config.particles.count; i++) {
            const angle = (i / config.particles.count) * Math.PI * 2;
            const radius = 1.5 + Math.random() * 0.5;

            positions.push(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                (Math.random() - 0.5) * 0.5
            );

            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

        return geometry;
    };

    const badgeGeometry = createBadgeGeometry();
    const particleGeometry = createParticles();

    return (
        <group>
            {/* Glow/Aura */}
            <mesh ref={glowRef}>
                <ringGeometry args={[config.geometry.innerRadius * 0.9, config.geometry.outerRadius * 1.1, 64]} />
                <meshBasicMaterial
                    color={config.colors.primary}
                    transparent
                    opacity={0.2 * config.effects.glowStrength}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Badge principal */}
            <mesh ref={badgeRef} geometry={badgeGeometry}>
                <meshStandardMaterial
                    vertexColors
                    metalness={config.effects.metalness}
                    roughness={config.effects.roughness}
                    emissive={config.colors.primary}
                    emissiveIntensity={config.effects.emissiveIntensity}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Anel interno */}
            <mesh rotation={[0, 0, 0]}>
                <ringGeometry args={[config.geometry.innerRadius * 0.6, config.geometry.innerRadius * 0.8, 32]} />
                <meshStandardMaterial
                    color={config.colors.secondary}
                    metalness={config.effects.metalness}
                    roughness={config.effects.roughness}
                    emissive={config.colors.secondary}
                    emissiveIntensity={config.effects.emissiveIntensity * 0.5}
                />
            </mesh>

            {/* Partículas */}
            {particleGeometry && (
                <points ref={particlesRef} geometry={particleGeometry}>
                    <pointsMaterial
                        size={config.particles.size}
                        vertexColors
                        transparent
                        opacity={0.8}
                        sizeAttenuation
                    />
                </points>
            )}

            {/* Luz pontual para iluminação extra */}
            <pointLight
                position={[0, 0, 2]}
                intensity={config.effects.glowStrength * 0.5}
                color={config.colors.primary}
                distance={5}
            />
        </group>
    );
};
