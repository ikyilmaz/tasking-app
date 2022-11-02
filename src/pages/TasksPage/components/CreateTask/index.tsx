import React from "react";
import { Form, Typography, Input, Select, Button } from "antd";
import { ITask } from "../../../../features/task/entities/ITask";
import { TaskPriority } from "../../../../features/task/entities/TaskPriority";
import styles from "./CreateTask.module.scss";
import { useAppDispatch } from "../../../../app/hooks";
import { addTask } from "../../../../features/task/taskSlice";
import { PlusOutlined } from "@ant-design/icons";

export const CreateTask: React.FC = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const onCreateTask = React.useCallback(async () => {
        const task: Omit<ITask, "id"> = await form.validateFields();
        dispatch(addTask(task));
        form.resetFields()
    }, [])

    return (
        <div className={styles.container}>
            <Typography.Title level={4}>Create Task</Typography.Title>
            <Form
                form={form}
                className={styles.createTask}
            >
                <Form.Item
                    className={styles.createTaskTitle}
                    name="title"
                    labelCol={{ span: 24 }}
                    label="Task Title"
                    rules={[
                        { required: true },
                        { max: 255 },
                        {
                            validator: (_, value: string = "") => new Promise<string | void>((resolve, reject) => {
                                if (/^[a-z0-9şçöğüı ]*$/i.test(value)) return resolve();
                                reject("'title' must be alphanumeric")
                            }),
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="priority"
                    labelCol={{ span: 24 }}
                    label="Task Priority"
                    rules={[{ required: true }]}
                >
                    <Select placeholder="Choose">
                        {
                            Object
                                .values(TaskPriority)
                                .map(priority => <Select.Option key={priority} value={priority}>{priority}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label={<span></span>}
                    labelCol={{ span: 24 }}
                >
                    <Button
                        onClick={onCreateTask}
                        className={styles.createTaskBtn}
                        icon={<PlusOutlined />}
                    >
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}