import { Drawer, DrawerContent } from '@progress/kendo-react-layout';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem } from '@progress/kendo-react-charts';
import type { Task, UserStats, Vibe } from './types';
import { VIBE_CONFIG } from './types';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  stats: UserStats;
}

export const AnalyticsDrawer = ({ isOpen, onClose, tasks, stats }: AnalyticsDrawerProps) => {
  const completedTasks = tasks.filter(t => t.completed);
  
  const vibeBreakdown = (Object.keys(VIBE_CONFIG) as Vibe[]).map(vibe => ({
    vibe: VIBE_CONFIG[vibe].label,
    count: completedTasks.filter(t => t.completedInVibe === vibe).length,
  }));

  const energyBreakdown = [
    { level: 'High Energy', count: completedTasks.filter(t => t.energyLevel === 'high').length },
    { level: 'Medium Energy', count: completedTasks.filter(t => t.energyLevel === 'medium').length },
    { level: 'Low Energy', count: completedTasks.filter(t => t.energyLevel === 'low').length },
  ];

  return (
    <Drawer
      expanded={isOpen}
      position="end"
      mode="overlay"
      width={400}
      onOverlayClick={onClose}
    >
      <DrawerContent>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="text-4xl font-black mb-2">{stats.level}</div>
              <div className="text-sm opacity-90">Current Level</div>
              <div className="mt-2 text-xs opacity-75">{stats.totalXP} XP earned</div>
            </div>

            <div>
              <h3 className="font-bold mb-3">Tasks by Vibe</h3>
              <Chart style={{ height: 200 }}>
                <ChartSeries>
                  <ChartSeriesItem type="column" data={vibeBreakdown} field="count" categoryField="vibe" />
                </ChartSeries>
                <ChartCategoryAxis>
                  <ChartCategoryAxisItem />
                </ChartCategoryAxis>
              </Chart>
            </div>

            <div>
              <h3 className="font-bold mb-3">Energy Distribution</h3>
              <Chart style={{ height: 200 }}>
                <ChartSeries>
                  <ChartSeriesItem type="donut" data={energyBreakdown} field="count" categoryField="level" />
                </ChartSeries>
              </Chart>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 rounded-xl p-3">
                  <div className="text-2xl font-bold">{completedTasks.length}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-3">
                  <div className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</div>
                  <div className="text-xs text-gray-600">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
