import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Calendar,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  Clock,
  Flag,
} from 'lucide-react';
import { Task } from '@/types/workos';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design System Updates',
    description: 'Update the design system with new color palette and typography',
    status: 'todo',
    priority: 'high',
    assignee: 'emp-001',
    assigneeName: 'Emma Employee',
    assigneeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    dueDate: '2024-01-15',
    createdAt: '2024-01-08',
    tags: ['design', 'ui'],
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Integrate third-party payment gateway API',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'emp-002',
    assigneeName: 'John Developer',
    assigneeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    dueDate: '2024-01-12',
    createdAt: '2024-01-05',
    tags: ['backend', 'api'],
  },
  {
    id: '3',
    title: 'User Testing',
    description: 'Conduct user testing sessions for new features',
    status: 'review',
    priority: 'medium',
    assignee: 'emp-003',
    assigneeName: 'Sarah Designer',
    assigneeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    dueDate: '2024-01-18',
    createdAt: '2024-01-06',
    tags: ['testing', 'ux'],
  },
  {
    id: '4',
    title: 'Documentation',
    description: 'Write documentation for the new API endpoints',
    status: 'done',
    priority: 'low',
    assignee: 'emp-004',
    assigneeName: 'Mike Writer',
    assigneeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    dueDate: '2024-01-10',
    createdAt: '2024-01-03',
    tags: ['docs'],
  },
];

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-muted' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-info/20' },
  { id: 'review', title: 'Review', color: 'bg-warning/20' },
  { id: 'done', title: 'Done', color: 'bg-success/20' },
];

const priorityColors: Record<string, 'ghost' | 'secondary' | 'warning' | 'destructive'> = {
  low: 'ghost',
  medium: 'secondary',
  high: 'warning',
  urgent: 'destructive',
};

const TaskCard: React.FC<{ task: Task; isDragging?: boolean }> = ({ task, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`task-card ${isDragging ? 'shadow-glow z-50' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant={priorityColors[task.priority]} className="text-xs">
          <Flag className="h-3 w-3 mr-1" />
          {task.priority}
        </Badge>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <h3 className="font-medium mb-2">{task.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {task.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
            <AvatarFallback>{task.assigneeName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{task.assigneeName.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>3</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const newStatus = columns.find((col) => col.id === overId)?.id || 
      tasks.find((t) => t.id === overId)?.status;

    if (newStatus && newStatus !== activeTask.status) {
      setTasks(tasks.map((t) =>
        t.id === activeTask.id ? { ...t, status: newStatus as Task['status'] } : t
      ));
      toast({
        title: 'Task Updated',
        description: `"${activeTask.title}" moved to ${newStatus.replace('-', ' ')}`,
      });
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title) {
      toast({
        title: 'Error',
        description: 'Please enter a task title',
        variant: 'destructive',
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignee: 'emp-001',
      assigneeName: 'Emma Employee',
      assigneeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      tags: [],
    };

    setTasks([...tasks, task]);
    setIsCreateModalOpen(false);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    toast({
      title: 'Task Created',
      description: `"${task.title}" has been added to the board`,
    });
  };

  return (
    <DashboardLayout title="Tasks" subtitle="Manage and track your work">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {columns.map((col) => (
            <Badge key={col.id} variant="outline" className="text-xs">
              {col.title}: {tasks.filter((t) => t.status === col.id).length}
            </Badge>
          ))}
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task['priority'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {tasks.filter((t) => t.status === column.id).length}
                  </Badge>
                </div>
              </div>
              <SortableContext
                id={column.id}
                items={tasks.filter((t) => t.status === column.id).map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={`kanban-column ${column.color} min-h-[500px] space-y-3`}>
                  <AnimatePresence>
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>
    </DashboardLayout>
  );
};

export default Tasks;
