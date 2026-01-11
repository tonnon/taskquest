import { Artifact } from '@/types/task';

export const ARTIFACTS: Artifact[] = [
  {
    id: 'discipline_core',
    name: 'Artefato da Disciplina',
    description: 'Liberado ao manter uma sequência lendária de hábitos concluídos.',
    icon: '🛡️',
    rarity: 'epic',
    unlockCondition: { type: 'habit_streak', streak: 30 },
    effects: [
      {
        type: 'avatar_glow',
        gradient: 'conic-gradient(from 180deg, rgba(14,165,233,0.8), rgba(16,185,129,0.9), rgba(14,165,233,0.8))',
      },
    ],
  },
  {
    id: 'architect_emblem',
    name: 'Emblema do Arquiteto',
    description: 'Reconhece quem concluiu 100 tarefas e moldou um fluxo impecável.',
    icon: '🏗️',
    rarity: 'rare',
    unlockCondition: { type: 'tasks_completed', total: 100 },
    effects: [
      {
        type: 'board_glow',
        gradient: 'linear-gradient(135deg, rgba(248,113,113,0.25), rgba(248,196,113,0.25))',
      },
    ],
  },
  {
    id: 'chronicle_relic',
    name: 'Relíquia do Cronista',
    description: 'Para quem marcou cada detalhe: 250 itens de checklist finalizados.',
    icon: '📜',
    rarity: 'legendary',
    unlockCondition: { type: 'checklists_completed', total: 250 },
    effects: [
      {
        type: 'avatar_glow',
        gradient: 'conic-gradient(from 90deg, rgba(249,115,22,0.85), rgba(245,158,11,0.95), rgba(249,115,22,0.85))',
      },
      {
        type: 'board_glow',
        gradient: 'linear-gradient(120deg, rgba(244,114,182,0.2), rgba(234,179,8,0.2))',
      },
    ],
  },
  {
    id: 'ascendant_fragment',
    name: 'Fragmento Ascendente',
    description: 'Atingir 7.500 XP totais libera a energia cristalina do board.',
    icon: '💎',
    rarity: 'legendary',
    unlockCondition: { type: 'xp_total', xp: 7500 },
    effects: [
      {
        type: 'avatar_glow',
        gradient: 'conic-gradient(from 0deg, rgba(191,219,254,0.9), rgba(99,102,241,0.85), rgba(191,219,254,0.9))',
      },
      {
        type: 'board_glow',
        gradient: 'linear-gradient(160deg, rgba(99,102,241,0.25), rgba(56,189,248,0.2))',
      },
    ],
  },
];
