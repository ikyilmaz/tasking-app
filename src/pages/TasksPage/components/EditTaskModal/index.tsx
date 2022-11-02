import React, { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd"
import { ITask } from "../../../../features/task/entities/ITask";
import { TaskPriority } from "../../../../features/task/entities/TaskPriority";
import { useAppDispatch } from "../../../../app/hooks";
import { updateTaskPriority } from "../../../../features/task/taskSlice";

export type EditTaskModalProps = {
    task: ITask | null;
    onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose }) => {
    const dispatch = useAppDispatch();

    const [form] = Form.useForm<Omit<ITask, "id">>();

    useEffect(() => {
        form.setFieldValue("title", task?.title);
        form.setFieldValue("priority", task?.priority);
    }, [task])

    const onOk = async () => {
        const { priority } = await form.validateFields()
        dispatch(updateTaskPriority({ id: task?.id as string, priority }))
        onClose();
    }

    return (
        <Modal okText="Save" onCancel={onClose} onOk={onOk} open={!!task} title="Task Edit">
            <Form form={form}>
                <Form.Item name="title" label="Title" labelCol={{ span: 24 }}>
                    <Input disabled />
                </Form.Item>

                <Form.Item name="priority" required label="Priority" labelCol={{ span: 24 }}>
                    <Select placeholder="Choose">
                        {
                            Object
                                .values(TaskPriority)
                                .map(priority => <Select.Option key={priority} value={priority}>{priority}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}