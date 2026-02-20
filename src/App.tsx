import { useState, useEffect } from 'react';
import { Badge } from '@progress/kendo-react-indicators';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import type { Vibe, Task, UserStats } from './types';
import { VIBE_CONFIG } from './types';
import { TaskDialog } from './TaskDialog';
import { AnalyticsDrawer } from './AnalyticsDrawer';
import './App.css';

const SAMPLE_TASKS: Task[] = [
  { id: '1', title: 'Refactor authentication module', description: 'Clean up legacy code', energyLevel: 'high', estimatedMinutes: 120, priority: 'high', completed: false, createdAt: Date.now(), tags: ['code'] },
  { id: '2', title: 'Review pull requests', description: 'Check team submissions', energyLevel: 'medium', estimatedMinutes: 30, priority: 'medium', completed: false, createdAt: Date.now(), tags: ['review'] },
  { id: '3', title: 'Update documentation', description: 'Add API examples', energyLevel: 'low', estimatedMinutes: 45, priority: 'low', completed: false, createdAt: Date.now(), tags: ['docs'] },
  { id: '4', title: 'Design new dashboard layout', description: 'Wireframes and mockups', energyLevel: 'high', estimatedMinutes: 90, priority: 'urgent', completed: false, createdAt: Date.now(), tags: ['design'] },
  { id: '5', title: 'Respond to emails', description: 'Clear inbox', energyLevel: 'low', estimatedMinutes: 20, priority: 'medium', completed: false, createdAt: Date.now(), tags: ['admin'] },
];

function App() {
  const [currentVibe, setCurrentVibe] = useState<Vibe | null>(null);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [stats, setStats] = useState<UserStats>({ totalXP: 0, level: 1, streak: 0, lastCheckIn: 0, vibeSessions: [] });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const filteredTasks = currentVibe
    ? tasks.filter(t => !t.completed && VIBE_CONFIG[currentVibe].taskFilter.includes(t.energyLevel))
    : tasks.filter(t => !t.completed);

  const handleVibeSelect = (vibe: Vibe) => {
    setCurrentVibe(vibe);
    setNotificationMessage(`Vibe set to ${VIBE_CONFIG[vibe].label}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const xpGain = task.energyLevel === 'high' ? 50 : task.energyLevel === 'medium' ? 30 : 15;
    const bonus = currentVibe && VIBE_CONFIG[currentVibe].taskFilter.includes(task.energyLevel) ? 1.5 : 1;
    const totalXP = Math.floor(xpGain * bonus);

    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true, completedAt: Date.now(), completedInVibe: currentVibe || undefined } : t));
    setStats(prev => ({ ...prev, totalXP: prev.totalXP + totalXP, level: Math.floor((prev.totalXP + totalXP) / 100) + 1 }));
    setNotificationMessage(`+${totalXP} XP ${bonus > 1 ? 'BONUS!' : ''}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    setTasks([...tasks, { ...task, id: uuidv4(), createdAt: Date.now(), completed: false }]);
  };

  const vibeTheme = currentVibe ? VIBE_CONFIG[currentVibe] : null;

  return (
    <div className={`min-h-screen transition-all duration-700 ${vibeTheme ? vibeTheme.bgClass : 'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50'}`}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header with Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/assets/logo.svg" alt="Vibe Check" className="w-20 h-20" />
            <h1 className="text-6xl font-black bg-gradient-to-r from-rose-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Vibe Check
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">Match your work to your energy</p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-4 justify-center mb-12 flex-wrap"
        >
          <div className="bg-white rounded-2xl px-8 py-4 shadow-lg border border-rose-100">
            <div className="text-4xl font-black bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">{stats.level}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Level</div>
          </div>
          <div className="bg-white rounded-2xl px-8 py-4 shadow-lg border border-orange-100">
            <div className="text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{stats.totalXP}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Total XP</div>
          </div>
          <div className="bg-white rounded-2xl px-8 py-4 shadow-lg border border-pink-100">
            <div className="text-4xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">{tasks.filter(t => t.completed).length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Completed</div>
          </div>
          <button
            onClick={() => setAnalyticsOpen(true)}
            className="bg-white rounded-2xl px-8 py-4 shadow-lg border border-purple-100 hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-3xl">📊</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Analytics</div>
          </button>
        </motion.div>

        {/* Vibe Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">How is your energy?</h2>
          <div className="flex gap-6 justify-center flex-wrap">
            {(Object.keys(VIBE_CONFIG) as Vibe[]).map((vibe) => (
              <motion.button
                key={vibe}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVibeSelect(vibe)}
                className={`relative px-10 py-8 rounded-3xl font-bold text-lg transition-all ${
                  currentVibe === vibe
                    ? `${VIBE_CONFIG[vibe].activeClass} shadow-2xl scale-110`
                    : `bg-white ${VIBE_CONFIG[vibe].borderClass} hover:shadow-xl`
                }`}
              >
                <img src={VIBE_CONFIG[vibe].icon} alt={VIBE_CONFIG[vibe].label} className="w-16 h-16 mx-auto mb-3" />
                <div className={currentVibe === vibe ? 'text-white' : 'text-gray-700'}>{VIBE_CONFIG[vibe].label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Task Grid */}
        <AnimatePresence mode="wait">
          {currentVibe && (
            <motion.div
              key={currentVibe}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all group ${VIBE_CONFIG[currentVibe].borderClass}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900">{task.title}</h3>
                    <Badge
                      themeColor={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'info'}
                      size="small"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm font-medium">{task.estimatedMinutes} min</span>
                    <button
                      onClick={() => handleTaskComplete(task.id)}
                      className={`px-5 py-2 ${VIBE_CONFIG[currentVibe].buttonClass} text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-md`}
                    >
                      Complete
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!currentVibe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 text-lg font-medium"
          >
            Select your current vibe to see matching tasks
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTaskDialogOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center text-4xl font-light hover:shadow-3xl transition-all"
        >
          +
        </motion.button>
      </div>

      {/* Notifications */}
      {showNotification && (
        <NotificationGroup style={{ right: 20, bottom: 20, position: 'fixed', zIndex: 10000 }}>
          <Notification
            type={{ style: 'success', icon: true }}
            closable={true}
            onClose={() => setShowNotification(false)}
          >
            <span className="font-semibold">{notificationMessage}</span>
          </Notification>
        </NotificationGroup>
      )}

      <TaskDialog
        isOpen={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        onSave={handleAddTask}
      />

      <AnalyticsDrawer
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        tasks={tasks}
        stats={stats}
      />
    </div>
  );
}

export default App;
