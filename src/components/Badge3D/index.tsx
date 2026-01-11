import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { Badge3DModel } from './Badge3DModel';
import { getBadgeConfig } from '@/utils/badgeTiers';

interface Badge3DProps {
    level: number;
    size?: number;
    interactive?: boolean;
}

export const Badge3D = ({ level, size = 120, interactive = false }: Badge3DProps) => {
    const config = getBadgeConfig(level);

    return (
        <div
            style={{
                width: size,
                height: size,
                position: 'relative',
            }}
        >
            <Canvas
                style={{
                    width: '100%',
                    height: '100%',
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={30} />

                {/* Luzes */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <directionalLight position={[-5, -5, -5]} intensity={0.3} />

                {/* Badge 3D */}
                <Suspense fallback={null}>
                    <Badge3DModel config={config} level={level} />
                </Suspense>

                {/* Controles (apenas se interativo) */}
                {interactive && (
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                )}
            </Canvas>

            {/* Badge tier name overlay */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-white/80 drop-shadow-lg whitespace-nowrap"
                style={{
                    textShadow: `0 0 10px ${config.colors.primary}`,
                }}
            >
                {config.name}
            </div>
        </div>
    );
};
