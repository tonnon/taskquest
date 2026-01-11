export interface BadgeTierConfig {
    tier: number;
    name: string;
    minLevel: number;
    maxLevel: number;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    effects: {
        emissiveIntensity: number;
        metalness: number;
        roughness: number;
        glowStrength: number;
    };
    geometry: {
        spikes: number;
        innerRadius: number;
        outerRadius: number;
        depth: number;
    };
    particles: {
        count: number;
        speed: number;
        size: number;
    };
}

// Função para calcular tier baseado no nível
export const calculateBadgeTier = (level: number): number => {
    if (level <= 10) return 0;
    if (level <= 20) return 1;
    if (level <= 35) return 2;
    if (level <= 50) return 3;
    if (level <= 70) return 4;
    if (level <= 90) return 5;
    if (level <= 120) return 6;
    if (level <= 160) return 7;
    if (level <= 200) return 8;

    // Para níveis infinitos, continua aumentando o tier
    return Math.floor(8 + (level - 200) / 50);
};

// Gera cor dinâmica para tiers altos usando HSL
const generateDynamicColor = (tier: number, variant: number = 0): string => {
    const hue = (tier * 37 + variant * 60) % 360; // Rotação de cor baseada em tier
    const saturation = Math.min(50 + tier * 3, 100);
    const lightness = 45 + variant * 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Configurações pré-definidas para os primeiros tiers
const predefinedTiers: BadgeTierConfig[] = [
    {
        tier: 0,
        name: 'Bronze',
        minLevel: 1,
        maxLevel: 10,
        colors: {
            primary: '#CD7F32',
            secondary: '#8B4513',
            accent: '#A0522D',
        },
        effects: {
            emissiveIntensity: 0.1,
            metalness: 0.6,
            roughness: 0.4,
            glowStrength: 0.2,
        },
        geometry: {
            spikes: 6,
            innerRadius: 0.8,
            outerRadius: 1.0,
            depth: 0.15,
        },
        particles: {
            count: 0,
            speed: 0,
            size: 0,
        },
    },
    {
        tier: 1,
        name: 'Iron',
        minLevel: 11,
        maxLevel: 20,
        colors: {
            primary: '#778899',
            secondary: '#536878',
            accent: '#98A8B8',
        },
        effects: {
            emissiveIntensity: 0.15,
            metalness: 0.7,
            roughness: 0.35,
            glowStrength: 0.3,
        },
        geometry: {
            spikes: 8,
            innerRadius: 0.75,
            outerRadius: 1.05,
            depth: 0.18,
        },
        particles: {
            count: 5,
            speed: 0.3,
            size: 0.02,
        },
    },
    {
        tier: 2,
        name: 'Silver',
        minLevel: 21,
        maxLevel: 35,
        colors: {
            primary: '#C0C0C0',
            secondary: '#A8A8A8',
            accent: '#E8E8E8',
        },
        effects: {
            emissiveIntensity: 0.25,
            metalness: 0.85,
            roughness: 0.25,
            glowStrength: 0.4,
        },
        geometry: {
            spikes: 10,
            innerRadius: 0.7,
            outerRadius: 1.1,
            depth: 0.2,
        },
        particles: {
            count: 10,
            speed: 0.4,
            size: 0.025,
        },
    },
    {
        tier: 3,
        name: 'Gold',
        minLevel: 36,
        maxLevel: 50,
        colors: {
            primary: '#FFD700',
            secondary: '#FFA500',
            accent: '#FFEC8B',
        },
        effects: {
            emissiveIntensity: 0.4,
            metalness: 0.9,
            roughness: 0.15,
            glowStrength: 0.6,
        },
        geometry: {
            spikes: 12,
            innerRadius: 0.65,
            outerRadius: 1.15,
            depth: 0.22,
        },
        particles: {
            count: 15,
            speed: 0.5,
            size: 0.03,
        },
    },
    {
        tier: 4,
        name: 'Platinum',
        minLevel: 51,
        maxLevel: 70,
        colors: {
            primary: '#E5E4E2',
            secondary: '#B4C7D9',
            accent: '#FFFFFF',
        },
        effects: {
            emissiveIntensity: 0.55,
            metalness: 0.95,
            roughness: 0.1,
            glowStrength: 0.8,
        },
        geometry: {
            spikes: 14,
            innerRadius: 0.6,
            outerRadius: 1.2,
            depth: 0.25,
        },
        particles: {
            count: 25,
            speed: 0.6,
            size: 0.035,
        },
    },
    {
        tier: 5,
        name: 'Diamond',
        minLevel: 71,
        maxLevel: 90,
        colors: {
            primary: '#B9F2FF',
            secondary: '#4FC3F7',
            accent: '#E0F7FA',
        },
        effects: {
            emissiveIntensity: 0.7,
            metalness: 1.0,
            roughness: 0.05,
            glowStrength: 1.0,
        },
        geometry: {
            spikes: 16,
            innerRadius: 0.55,
            outerRadius: 1.25,
            depth: 0.28,
        },
        particles: {
            count: 35,
            speed: 0.7,
            size: 0.04,
        },
    },
    {
        tier: 6,
        name: 'Mythic',
        minLevel: 91,
        maxLevel: 120,
        colors: {
            primary: '#9C27B0',
            secondary: '#E91E63',
            accent: '#FF4081',
        },
        effects: {
            emissiveIntensity: 0.85,
            metalness: 1.0,
            roughness: 0.02,
            glowStrength: 1.3,
        },
        geometry: {
            spikes: 18,
            innerRadius: 0.5,
            outerRadius: 1.3,
            depth: 0.3,
        },
        particles: {
            count: 50,
            speed: 0.8,
            size: 0.045,
        },
    },
    {
        tier: 7,
        name: 'Celestial',
        minLevel: 121,
        maxLevel: 160,
        colors: {
            primary: '#00BCD4',
            secondary: '#00E5FF',
            accent: '#84FFFF',
        },
        effects: {
            emissiveIntensity: 1.0,
            metalness: 1.0,
            roughness: 0.01,
            glowStrength: 1.6,
        },
        geometry: {
            spikes: 20,
            innerRadius: 0.45,
            outerRadius: 1.35,
            depth: 0.32,
        },
        particles: {
            count: 70,
            speed: 0.9,
            size: 0.05,
        },
    },
    {
        tier: 8,
        name: 'Divine',
        minLevel: 161,
        maxLevel: 200,
        colors: {
            primary: '#FFC107',
            secondary: '#FF9800',
            accent: '#FFEB3B',
        },
        effects: {
            emissiveIntensity: 1.2,
            metalness: 1.0,
            roughness: 0.0,
            glowStrength: 2.0,
        },
        geometry: {
            spikes: 24,
            innerRadius: 0.4,
            outerRadius: 1.4,
            depth: 0.35,
        },
        particles: {
            count: 100,
            speed: 1.0,
            size: 0.06,
        },
    },
];

// Gera configuração dinâmica para tiers altos (infinito)
const generateDynamicTierConfig = (tier: number): BadgeTierConfig => {
    const baseLevel = 200 + (tier - 8) * 50;

    return {
        tier,
        name: `Transcendent ${tier - 8}`,
        minLevel: baseLevel,
        maxLevel: baseLevel + 49,
        colors: {
            primary: generateDynamicColor(tier, 0),
            secondary: generateDynamicColor(tier, 1),
            accent: generateDynamicColor(tier, 2),
        },
        effects: {
            emissiveIntensity: Math.min(1.2 + (tier - 8) * 0.1, 3.0),
            metalness: 1.0,
            roughness: 0.0,
            glowStrength: Math.min(2.0 + (tier - 8) * 0.2, 5.0),
        },
        geometry: {
            spikes: Math.min(24 + (tier - 8) * 2, 48),
            innerRadius: Math.max(0.4 - (tier - 8) * 0.02, 0.2),
            outerRadius: Math.min(1.4 + (tier - 8) * 0.05, 2.0),
            depth: Math.min(0.35 + (tier - 8) * 0.02, 0.6),
        },
        particles: {
            count: Math.min(100 + (tier - 8) * 20, 300),
            speed: Math.min(1.0 + (tier - 8) * 0.1, 2.5),
            size: Math.min(0.06 + (tier - 8) * 0.005, 0.12),
        },
    };
};

// Função principal para obter configuração do badge
export const getBadgeConfig = (level: number): BadgeTierConfig => {
    const tier = calculateBadgeTier(level);

    // Retorna configuração pré-definida se existir
    if (tier < predefinedTiers.length) {
        return predefinedTiers[tier];
    }

    // Gera configuração dinâmica para tiers altos
    return generateDynamicTierConfig(tier);
};
