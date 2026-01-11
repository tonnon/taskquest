import { useEffect, useMemo } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useShallow } from 'zustand/react/shallow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, Zap, Award } from 'lucide-react';
import { Mission } from '@/types/task';
import { cn } from '@/lib/utils';

const MissionCard = ({
  mission,
  onClaim,
}: {
  mission: Mission;
  onClaim: (missionId: string) => void;
}) => {
  const progressPercent = Math.round((mission.progress / mission.target) * 100);
  const canClaim = mission.completed && !mission.claimed;

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-background/60 p-4 backdrop-blur',
        mission.completed ? 'shadow-[0_0_25px_rgba(34,197,94,0.15)]' : ''
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm text-primary">
            {mission.icon ? <span>{mission.icon}</span> : <Award className="h-4 w-4" />}
            <span className="font-semibold uppercase tracking-wide text-xs">
              {mission.category}
            </span>
          </div>
          <CardTitle className="text-lg mt-1">{mission.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{mission.description}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Recompensa</p>
          <p className="text-base font-semibold text-amber-300">
            +{mission.rewardXp} XP
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Progresso • {mission.progress}/{mission.target}
          </span>
          {mission.claimed ? (
            <span className="text-emerald-400 font-medium">Reivindicado</span>
          ) : mission.completed ? (
            <span className="text-emerald-300 font-medium">Pronto para receber</span>
          ) : (
            <span>{progressPercent}%</span>
          )}
        </div>
        <Progress value={progressPercent} className="h-2 bg-muted" />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          size="sm"
          disabled={!canClaim}
          onClick={() => onClaim(mission.id)}
        >
          {mission.claimed ? 'Recebido' : canClaim ? 'Receber XP' : 'Em progresso'}
        </Button>
      </div>
    </div>
  );
};

const MissionsPanel = () => {
  const missionState = useTaskStore((state) => state.missionState);
  const refreshMissionState = useTaskStore((state) => state.refreshMissionState);
  const claimMissionReward = useTaskStore((state) => state.claimMissionReward);

  const missionSections = useMemo(
    () => [
      { title: 'Missões diárias', type: 'daily' as const, missions: missionState.daily },
      { title: 'Missões semanais', type: 'weekly' as const, missions: missionState.weekly },
    ],
    [missionState.daily, missionState.weekly]
  );

  useEffect(() => {
    refreshMissionState();
  }, [refreshMissionState]);

  const stats = useMemo(() => {
    const total = missionSections.reduce((acc, section) => acc + section.missions.length, 0);
    const completed = missionSections.reduce(
      (acc, section) => acc + section.missions.filter((mission) => mission.completed).length,
      0
    );
    return { total, completed };
  }, [missionSections]);

  return (
    <section className="space-y-4">
      <Card className="border-white/5 bg-gradient-to-b from-background/85 to-background/40 backdrop-blur">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Painel de Missões
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              {stats.completed}/{stats.total} concluídas
            </div>
          </div>
          <CardTitle className="text-2xl">Ganhe XP extra todos os dias</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete missões diárias e semanais para acelerar sua evolução. Reivindique o XP assim que cada objetivo for concluído.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {missionSections.map((section) => (
              <div key={section.type} className="rounded-2xl border border-white/10 bg-background/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">{section.title}</p>
                  <span className="text-xs text-muted-foreground/80">
                    {section.missions.filter((mission) => mission.completed).length}/{section.missions.length} completas
                  </span>
                </div>

                <div className="space-y-3">
                  {section.missions.map((mission) => (
                    <MissionCard key={mission.id} mission={mission} onClaim={claimMissionReward} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default MissionsPanel;
