import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ITask } from './entities/ITask';
import { TaskPriority } from './entities/TaskPriority';

export interface TaskState {
  tasks: ITask[];
}

const initialState: TaskState = {
  tasks: JSON.parse(localStorage.getItem("my-tasks-unique") || "[]") as ITask[],
};

const setTasksToLocal = (tasks: ITask[]) => localStorage.setItem("my-tasks-unique", JSON.stringify(tasks));

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<ITask, "id">>) => {
      const task: ITask = { ...action.payload, id: Date.now().toString() };
      state.tasks.push(task);
      setTasksToLocal(state.tasks);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      setTasksToLocal(state.tasks);
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: TaskPriority }>) => {
      const task = state.tasks.find(({ id }) => id === action.payload.id);
      if (!task) throw new Error("Task not found")
      task.priority = action.payload.priority;
      setTasksToLocal(state.tasks);
    },
  },
});

export const { addTask, removeTask, updateTaskPriority } = taskSlice.actions;

export const selectTasks = (state: RootState) => state.task.tasks;
export const selectTasksCount = (state: RootState) => state.task.tasks.length;

export default taskSlice.reducer;
