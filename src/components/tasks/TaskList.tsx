import { TaskCard } from "./TaskCard";
import type { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: ((task: Task) => void) | undefined;
  onEdit?: ((task: Task) => void) | undefined;
  onDelete?: ((task: Task) => void) | undefined;
}

export function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
