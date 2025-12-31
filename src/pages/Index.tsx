import { Helmet } from 'react-helmet-async';
import { Sparkles } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';
import XpBar from '@/components/XpBar';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TaskQuest - Gerenciador de Tarefas Gamificado</title>
        <meta name="description" content="Gerencie suas tarefas de forma divertida e produtiva com TaskQuest. Sistema Kanban com gamificação, XP e níveis para motivar sua produtividade." />
        <meta name="keywords" content="tarefas, produtividade, kanban, gamificação, todo list, gestão de tarefas" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
          {/* Header */}
          <header className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="text-gradient">TaskQuest</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-sm md:text-base">
              Complete tarefas, ganhe XP e suba de nível! 🚀
            </p>
          </header>

          {/* XP Bar */}
          <XpBar />

          {/* Kanban Board */}
          <main>
            <KanbanBoard />
          </main>

          {/* Footer */}
          <footer className="text-center py-4">
            <p className="text-xs text-muted-foreground">
              Arraste as tarefas entre colunas para organizar seu trabalho
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
