import { TaskPriority } from "./TaskPriority";

export interface ITask {
    id: string;
    title: string;
    priority: TaskPriority;
}