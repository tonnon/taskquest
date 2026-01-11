import { CSSProperties } from 'react';

export type FrameTheme = {
    minLevel: number;
    name: string;
    ringGradient: string;
    auraColor: string;
    accentMain: string;
    accentSecondary: string;
    emberColor: string;
    sideAccent: string;
    gemColor: string;
    gemGlow: string;
    showWings?: boolean;
    showOrnaments?: boolean;
    showGlow?: boolean;
    badge: {
        background: string;
        border: string;
        text: string;
    };
};

export const FRAME_THEMES: FrameTheme[] = [
    {
        minLevel: 0,
        name: 'Piltover',
        ringGradient: 'conic-gradient(from 90deg, #f6e4ba, #c08a3c, #f6e4ba)',
        auraColor: 'rgba(255, 210, 150, 0.45)',
        accentMain: '#fce7ba',
        accentSecondary: '#c68f3a',
        emberColor: '#ffdca3',
        sideAccent: '#f3c06f',
        gemColor: '#8de7ff',
        gemGlow: 'rgba(141, 231, 255, 0.85)',
        showWings: false,
        showOrnaments: false,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #ffe4b6 0%, #c98836 100%)',
            border: '#f7c46b',
            text: '#3d2400',
        },
    },
    {
        minLevel: 30,
        name: 'Zaun',
        ringGradient: 'conic-gradient(from 90deg, #1a4728, #54ff8a, #1a4728)',
        auraColor: 'rgba(83, 255, 170, 0.4)',
        accentMain: '#59ff95',
        accentSecondary: '#1c3c28',
        emberColor: '#34c86c',
        sideAccent: '#5aff93',
        gemColor: '#a7ffd4',
        gemGlow: 'rgba(101, 255, 173, 0.85)',
        showWings: true,
        showOrnaments: false,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #4fff8a 0%, #10341e 100%)',
            border: '#4fff88',
            text: '#00150c',
        },
    },
    {
        minLevel: 50,
        name: 'Hextec',
        ringGradient: 'conic-gradient(from 90deg, #1d456b, #52dfff, #f8c067, #1d456b)',
        auraColor: 'rgba(80, 202, 255, 0.45)',
        accentMain: '#55d7ff',
        accentSecondary: '#f3ad63',
        emberColor: '#f9c47e',
        sideAccent: '#48c9ff',
        gemColor: '#9cf0ff',
        gemGlow: 'rgba(118, 233, 255, 0.85)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #5ce2ff 0%, #f0a257 100%)',
            border: '#66dfff',
            text: '#0b1b2e',
        },
    },
    {
        minLevel: 75,
        name: 'Fogo',
        ringGradient: 'conic-gradient(from 90deg, #5b1200, #ff6a00, #ffd56f, #5b1200)',
        auraColor: 'rgba(255, 120, 60, 0.55)',
        accentMain: '#ff944d',
        accentSecondary: '#7b1b00',
        emberColor: '#ff6a1c',
        sideAccent: '#ffb347',
        gemColor: '#ffd055',
        gemGlow: 'rgba(255, 167, 69, 0.85)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #ffb347 0%, #bf360c 100%)',
            border: '#ff861f',
            text: '#2b0a00',
        },
    },
    {
        minLevel: 100,
        name: 'Arco Celeste',
        ringGradient: 'conic-gradient(from 90deg, #f2f7ff, #7dd3ff, #c3d9ff, #f2f7ff)',
        auraColor: 'rgba(180, 220, 255, 0.55)',
        accentMain: '#9fd7ff',
        accentSecondary: '#dae6ff',
        emberColor: '#e8f2ff',
        sideAccent: '#7fc4ff',
        gemColor: '#e9fdff',
        gemGlow: 'rgba(222, 247, 255, 0.9)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #f7fbff 0%, #8dc7ff 100%)',
            border: '#b8d9ff',
            text: '#0e1b33',
        },
    },
    {
        minLevel: 125,
        name: 'Infundido',
        ringGradient: 'conic-gradient(from 90deg, #4a0628, #f45bff, #f6c153, #4a0628)',
        auraColor: 'rgba(244, 91, 255, 0.5)',
        accentMain: '#f06dff',
        accentSecondary: '#671245',
        emberColor: '#ff9de5',
        sideAccent: '#ff5fd2',
        gemColor: '#ffe477',
        gemGlow: 'rgba(255, 221, 128, 0.9)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #ff96ea 0%, #7b1f55 100%)',
            border: '#ff73d6',
            text: '#3b0024',
        },
    },
    {
        minLevel: 150,
        name: 'Ilhas das Sombras',
        ringGradient: 'conic-gradient(from 90deg, #0f1d33, #32f1ff, #0f1d33)',
        auraColor: 'rgba(50, 241, 255, 0.45)',
        accentMain: '#43f4ff',
        accentSecondary: '#0b2236',
        emberColor: '#2bc3d0',
        sideAccent: '#7efbff',
        gemColor: '#7ffbff',
        gemGlow: 'rgba(119, 255, 255, 0.85)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #4af7ff 0%, #0a2837 100%)',
            border: '#53faff',
            text: '#001820',
        },
    },
    {
        minLevel: 175,
        name: 'Shurima',
        ringGradient: 'conic-gradient(from 90deg, #1f3d25, #e1ff7a, #b6e063, #1f3d25)',
        auraColor: 'rgba(225, 255, 122, 0.45)',
        accentMain: '#d7ff82',
        accentSecondary: '#2c4b2c',
        emberColor: '#b4ff76',
        sideAccent: '#f3dc79',
        gemColor: '#fff3a6',
        gemGlow: 'rgba(255, 237, 154, 0.85)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #f8ff9e 0%, #4a612c 100%)',
            border: '#f0ff90',
            text: '#1f2c0e',
        },
    },
    {
        minLevel: 200,
        name: 'Lunari',
        ringGradient: 'conic-gradient(from 90deg, #1d0f3a, #a47bff, #5130a6, #1d0f3a)',
        auraColor: 'rgba(164, 123, 255, 0.5)',
        accentMain: '#c1a0ff',
        accentSecondary: '#452470',
        emberColor: '#a373ff',
        sideAccent: '#b68bff',
        gemColor: '#f4e7ff',
        gemGlow: 'rgba(229, 211, 255, 0.9)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #cba5ff 0%, #3a1f63 100%)',
            border: '#c89fff',
            text: '#f8f5ff',
        },
    },
    {
        minLevel: 225,
        name: 'Reinos Combatentes',
        ringGradient: 'conic-gradient(from 90deg, #0f2a1e, #3effc0, #0f2a1e)',
        auraColor: 'rgba(62, 255, 192, 0.45)',
        accentMain: '#48ffc7',
        accentSecondary: '#123428',
        emberColor: '#1fd7a1',
        sideAccent: '#58ffd4',
        gemColor: '#b0ffe7',
        gemGlow: 'rgba(134, 255, 222, 0.9)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #66ffd5 0%, #0b3c2c 100%)',
            border: '#62ffd4',
            text: '#00261b',
        },
    },
    {
        minLevel: 250,
        name: 'Freljord',
        ringGradient: 'conic-gradient(from 90deg, #0d1f34, #7adeff, #b3f3ff, #0d1f34)',
        auraColor: 'rgba(122, 222, 255, 0.55)',
        accentMain: '#a4ecff',
        accentSecondary: '#12405d',
        emberColor: '#87d8ff',
        sideAccent: '#c3f9ff',
        gemColor: '#e5fbff',
        gemGlow: 'rgba(197, 242, 255, 0.9)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #ccf6ff 0%, #0f405d 100%)',
            border: '#aeefff',
            text: '#052030',
        },
    },
    {
        minLevel: 300,
        name: 'Desafiante',
        ringGradient: 'conic-gradient(from 90deg, #f5d76e, #00d2ff, #f5d76e)', // Gold & Cyan
        auraColor: 'rgba(0, 210, 255, 0.6)', // Cyan Aura
        accentMain: '#00d2ff', // Cyan Glows
        accentSecondary: '#f5d76e', // Gold Structure
        emberColor: '#ffffff',
        sideAccent: '#00d2ff',
        gemColor: '#ffffff',
        gemGlow: 'rgba(0, 210, 255, 0.9)',
        showWings: true,
        showOrnaments: true,
        showGlow: true,
        badge: {
            background: 'linear-gradient(180deg, #091428 0%, #000000 100%)', // Dark background like ref
            border: '#00d2ff', // Cyan border
            text: '#f5d76e', // Gold text
        },
    },
];

export const getFrameTheme = (level: number): FrameTheme => {
    for (let i = FRAME_THEMES.length - 1; i >= 0; i--) {
        if (level >= FRAME_THEMES[i].minLevel) {
            return FRAME_THEMES[i];
        }
    }
    return FRAME_THEMES[0];
};

export const getRankStyles = (level: number): CSSProperties => {
    const theme = getFrameTheme(level);
    const milestone = Math.floor(level / 25);
    const thickness = 3 + milestone;
    const glow = 16 + milestone * 6;
    const innerGlow = glow / 1.6;

    return {
        boxShadow: [
            `0 0 0 ${thickness}px ${theme.accentSecondary}`,
            `0 0 0 ${thickness + 2}px ${theme.accentMain}`,
            `0 0 ${glow}px ${theme.auraColor}`,
            `inset 0 0 ${innerGlow}px ${theme.accentMain}`,
        ].join(', '),
        background: theme.ringGradient,
        borderRadius: '9999px',
        transition: 'all 0.6s ease',
    };
};

export type FrameRarity = 'common' | 'rare' | 'epic' | 'legendary';

export const getRarity = (level: number): FrameRarity => {
    if (level < 30) return 'common';
    if (level < 75) return 'rare';
    if (level < 150) return 'epic';
    return 'legendary';
};

export const getRankClassNames = (_level?: number) => {
    return 'relative rounded-full transition-all duration-500';
};
