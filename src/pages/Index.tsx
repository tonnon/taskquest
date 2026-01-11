import { Helmet } from 'react-helmet-async';
import { LogOut, UserRound, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '@/components/KanbanBoard';
import UserAvatar from '@/components/UserAvatar';
import HabitSection from '@/components/HabitSection';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskStore } from '@/store/taskStore';

const Index = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleOpenAvatarUpload = () => {
    window.dispatchEvent(new CustomEvent('taskquest:open-avatar-upload'));
  };

  return (
    <>
      <Helmet>
        <title>Taskquest</title>
        <meta name="description" content="Gerencie suas tarefas de forma divertida e produtiva com Taskquest. Sistema Kanban com gamificação, XP e níveis para motivar sua produtividade." />
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
          <header className="grid gap-6 md:grid-cols-[1fr_auto_1fr] items-center">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <img
                src="/logo.png"
                alt="Taskquest"
                className="w-12 h-12 rounded-xl object-contain"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  <span className="text-gradient">Taskquest</span>
                </h1>
                <p className="text-sm text-muted-foreground hidden md:block">Domine seus desafios diários</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <UserAvatar />
            </div>

            <div className="flex justify-center md:justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-foreground shadow hover:bg-white/10 focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <UserRound className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      handleOpenAvatarUpload();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Trocar imagem
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(event) => {
                      event.preventDefault();
                      handleSignOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>



          {/* Kanban Board */}
          <main className="space-y-6">
            <KanbanBoard />
            <HabitSection />
          </main>

        </div>
      </div>
    </>
  );
};

export default Index;
