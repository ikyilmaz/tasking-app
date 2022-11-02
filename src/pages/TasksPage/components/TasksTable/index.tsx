import React from "react";
import { Table, Tag, Button, Popconfirm, Input } from "antd";
import { ColumnsType } from "antd/lib/table";
import { ITask } from "../../../../features/task/entities/ITask";
import { removeTask, selectTasks } from "../../../../features/task/taskSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { TaskPriority } from "../../../../features/task/entities/TaskPriority";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { EditTaskModal } from "../EditTaskModal";

const comparePriority = {
    [TaskPriority.URGENT]: "1",
    [TaskPriority.TRIVIAL]: "2",
    [TaskPriority.REGULAR]: "3",
};

export const TasksTable: React.FC = () => {
    const tasks = useAppSelector(selectTasks);
    const dispatch = useAppDispatch();

    const [editingTask, setEditingTask] = React.useState<ITask | null>(null);

    const onRemoveTask = React.useCallback((id: string) => {
        dispatch(removeTask(id))
    }, [])

    const columns = React.useMemo<ColumnsType<ITask>>(() => [
        {
            key: "title",
            title: "Title",
            dataIndex: "title",
            sorter: (a, b) => a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={"Search title"}
                        value={selectedKeys[0]}
                        onChange={e => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                            confirm({ closeDropdown: false });
                        }}
                        onPressEnter={() => confirm()}
                    />
                </div>
            ),
            onFilter: (value, record) => record.title.toLocaleLowerCase().includes(value.toString().toLocaleLowerCase()),
        },
        {
            key: "priority",
            title: "Priority",
            dataIndex: "priority",
            width: "30%",
            render: (value: TaskPriority) => {
                let color!: string;

                switch (value) {
                    case TaskPriority.REGULAR: color = "#ffba00"; break;
                    case TaskPriority.TRIVIAL: color = "#5c3bc2"; break;
                    case TaskPriority.URGENT: color = "#e0455e"; break;
                }

                return <Tag color={color}>{value}</Tag>
            },
            sorter: (a, b) => comparePriority[a.priority].localeCompare(comparePriority[b.priority]),
            defaultSortOrder: "ascend",
            filters: [
                {
                    text: TaskPriority.REGULAR,
                    value: TaskPriority.REGULAR
                },
                {
                    text: TaskPriority.TRIVIAL,
                    value: TaskPriority.TRIVIAL
                },
                {
                    text: TaskPriority.URGENT,
                    value: TaskPriority.URGENT
                }
            ],
            onFilter: (value, record) => record.priority === value

        },
        {
            key: "action",
            title: "Action",
            width: "15%",
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => setEditingTask(record)}
                        type="link"
                        shape="circle"
                        icon={<EditTwoTone style={{ fontSize: 18 }} />}
                    />
                    <Popconfirm title="Are you sure delete this task?" onConfirm={() => onRemoveTask(record.id)}>
                        <Button
                            type="link"
                            shape="circle"
                            icon={<DeleteTwoTone style={{ fontSize: 18 }} twoToneColor="crimson" />}
                        />
                    </Popconfirm>
                </>
            )

        }
    ], [])

    return (
        <>
            <EditTaskModal onClose={() => setEditingTask(null)} task={editingTask} />
            <Table pagination={false} rowKey="id" dataSource={tasks} columns={columns} />
        </>
    )
}