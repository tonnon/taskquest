# TaskQuest

Aplicação de produtividade gamificada que transforma o gerenciamento das suas tarefas em uma experiência RPG com checklist aninhado, hábitos diários e progressão de XP.

<p align="center">
  <img src="https://github.com/user-attachments/assets/placeholder-taskquest-cover.png" alt="TaskQuest preview" width="680" />
</p>

## ✨ Highlights

- **Quadro Kanban com drag & drop** para visualizar o fluxo das tarefas.
- **Checklists com sub-itens** (aninhados) e UX minimalista para criação rápida.
- **Sistema de hábitos** com controle de progresso diário e bonificação.
- **Progressão de XP e níveis** com feedback visual (confetti, badge e glow no avatar).
- **Sincronização via Firebase/Firestore** mantendo tarefas, hábitos e avatar entre dispositivos.
- **Design system com shadcn-ui + Tailwind**, tipografia elegante e animações com Framer Motion.

## 🧱 Stack Principal

| Categoria        | Tecnologias                                                                 |
|------------------|------------------------------------------------------------------------------|
| Frontend         | Vite, React 18, TypeScript, Zustand, React Router                           |
| UI/UX            | shadcn-ui, Tailwind CSS, Lucide Icons, Framer Motion                         |
| Estado & Dados   | Zustand com persist + Firestore (Firebase)                                   |
| Outras libs chave| @dnd-kit (drag & drop), date-fns, React Hook Form, zod                       |

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm 9+
- Conta Firebase com Firestore habilitado

### Setup

```bash
git clone https://github.com/<seu-usuario>/taskquest.git
cd taskquest
npm install
```

Crie um arquivo `.env` (ou `.env.local`) na raiz copiando o exemplo abaixo com suas credenciais Firebase:

```env
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
VITE_FIREBASE_APP_ID=1:xxxxx:web:xxxxx
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview    # opcional, para validar o bundle localmente
```

Implante o conteúdo de `dist/` na sua plataforma preferida (Vercel, Netlify, Firebase Hosting, etc.).

## 🧰 Scripts úteis

| Comando         | Descrição                              |
|-----------------|----------------------------------------|
| `npm run dev`   | Ambiente local com Vite                |
| `npm run build` | Bundle otimizado de produção           |
| `npm run preview` | Servidor local do build              |
| `npm run lint`  | ESLint (React + TypeScript)            |

## 📁 Estrutura resumida

```
src/
├─ components/      # UI (Kanban, Checklist, Habits, Avatar, etc.)
├─ store/           # Zustand store + sincronização Firestore
├─ types/           # Tipagens globais (Task, ChecklistItem, Progress, ...)
├─ services/        # firestoreService e integrações
├─ data/            # dados estáticos (ex.: artifacts)
└─ pages/           # rotas principais (Index, auth)
```

## 🧪 Roadmap / Ideias

- [x] Sub-checklists com CR*UD completo
- [x] UI minimalista para adicionar sub-itens via ícone
- [x] Toggle para ocultar/exibir sub-itens com animação
- [ ] Sistema de coleção de artefatos com efeitos em avatar/board
- [ ] Notificações ou lembretes inteligentes

## 🤝 Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch feature: `git checkout -b feature/minha-feature`.
3. Commits semânticos e focados.
4. Abra um PR descrevendo claramente a motivação e a solução.

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

Made with 💜 by TaskQuest contributors. Sinta-se livre para adaptar o projeto ao seu fluxo e compartilhar melhorias!
