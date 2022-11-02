import { Typography } from "antd";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectTasksCount } from "../../features/task/taskSlice";
import { CreateTask } from "./components/CreateTask";
import { TasksTable } from "./components/TasksTable";
import styles from "./TasksPage.module.scss";

export const TasksPage: React.FC = () => {
    const tasksCount = useAppSelector(selectTasksCount);

    return (
        <div className={styles.container}>
            <div className={styles.createTaskContainer}>
                <CreateTask />
            </div>
            <div className={styles.tasksContainer}>
                <div className={styles.tasksContainerHeader}>
                    <Typography.Title level={4}>Task List</Typography.Title>
                    <Typography.Text strong>({tasksCount}/{tasksCount})</Typography.Text>
                </div>
                <TasksTable />
            </div>
        </div>
    )
}