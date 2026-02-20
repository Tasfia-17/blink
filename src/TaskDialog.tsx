import { useState } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import type { Task } from './types';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export const TaskDialog = ({ isOpen, onClose, onSave }: TaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [priority, setPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, description, energyLevel, estimatedMinutes, priority, tags: [] });
    setTitle('');
    setDescription('');
    setEnergyLevel('medium');
    setEstimatedMinutes(30);
    setPriority('medium');
    onClose();
  };

  return (
    <Dialog title="Add New Task" onClose={onClose} width={500}>
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Task Title</label>
          <Input value={title} onChange={(e) => setTitle(e.value)} placeholder="What needs to be done?" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.value)} placeholder="Add details..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Energy Level</label>
            <DropDownList
              data={['high', 'medium', 'low']}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Priority</label>
            <DropDownList
              data={['urgent', 'high', 'medium', 'low']}
              value={priority}
              onChange={(e) => setPriority(e.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Estimated Time (minutes)</label>
          <Input type="number" value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(Number(e.value))} />
        </div>
      </div>
      <DialogActionsBar>
        <Button onClick={onClose}>Cancel</Button>
        <Button themeColor="primary" onClick={handleSave}>Add Task</Button>
      </DialogActionsBar>
    </Dialog>
  );
};
