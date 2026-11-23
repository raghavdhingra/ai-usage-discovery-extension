import { BrandHeader } from '@/common/components/BrandHeader';
import { countInteractions } from '@/common/utils/interactions';
import { Loader } from '@/common/components/Loader';
import { StatTiles } from '@/sidepanel/components/StatTiles';
import { ToolCard } from '@/sidepanel/components/ToolCard';
import { useVisits } from '@/sidepanel/hooks/useVisits';
import { groupByTool } from '@/sidepanel/utils/groupByTool';

export function App() {
  const { visits, loading, error, clear } = useVisits();
  const groups = groupByTool(visits);

  const clearData = () => {
    if (window.confirm(`Delete all ${visits.length} visits? This can't be undone.`)) void clear();
  };

  return (
    <div className="flex min-h-screen min-w-80 flex-col">
      <BrandHeader />

      <main className="flex flex-1 flex-col gap-4 p-4">
        {loading ? (
          <Loader label="Loading visits…" />
        ) : error ? (
          <p className="text-sm text-status-error">Couldn't load visits.</p>
        ) : (
          <>
            <StatTiles
              tools={groups.length}
              visits={visits.length}
              interactions={countInteractions(visits)}
            />

            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Detected tools</span>

            {groups.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-slate-500">
                No AI tools detected yet. Visit an AI tool and it will show up here.
              </p>
            ) : (
              groups.map((group) => <ToolCard key={group.latest.toolId} {...group} />)
            )}
          </>
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-line bg-card px-4 py-3">
        <button
          type="button"
          onClick={clearData}
          disabled={visits.length === 0}
          className="w-full cursor-pointer rounded-lg border border-status-error px-3 py-2 text-sm font-medium text-status-error transition-colors hover:bg-status-error-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear data
        </button>
      </footer>
    </div>
  );
}
