const columns = [
  { title: 'A Fazer', icon: '📋' },
  { title: 'Em Progresso', icon: '⚡' },
  { title: 'Concluído', icon: '✨' },
];

const KanbanSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-pulse">
      {columns.map((column) => (
        <div
          key={column.title}
          className="flex flex-col rounded-2xl bg-secondary/10 border border-border/30 overflow-hidden min-h-[500px]"
        >
          <div className="p-4 bg-secondary/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl opacity-40">{column.icon}</span>
              <div className="h-4 w-24 bg-muted/40 rounded" />
            </div>
            <div className="h-5 w-10 bg-muted/40 rounded-full" />
          </div>

          <div className="flex-1 p-4 space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="space-y-3 rounded-2xl bg-background/60 border border-border/20 p-4">
                <div className="h-4 w-3/4 bg-muted/30 rounded" />
                <div className="h-3 w-1/2 bg-muted/20 rounded" />
                <div className="space-y-2">
                  {[...Array(2)].map((__, i) => (
                    <div key={i} className="h-3 w-full bg-muted/20 rounded" />
                  ))}
                </div>
              </div>
            ))}

            {column.title === 'A Fazer' && (
              <div className="h-12 w-full rounded-xl border border-dashed border-primary/30 bg-transparent" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanSkeleton;
