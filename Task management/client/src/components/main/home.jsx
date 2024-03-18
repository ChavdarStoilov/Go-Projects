import * as api from "../../api/api.v1";
import TableRows from "./tableRows";
import { useEffect, useState } from "react";
import { TextInput, Box, NativeSelect, Button } from "@mantine/core";
import { Table } from "@mantine/core";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [updateList, setUpdateList] = useState(false);

    useEffect(() => {
        setUpdateList(false);

        api.get_tasks()
            .then((result) => {
                setTasks(result.data);
            })
            .catch((error) => console.log(error));
    }, [updateList]);

    const FormHandler = (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target));

        data["status_id"] = parseInt(data["status_id"]);

        api.create_task(data)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setUpdateList(true);
            });
    };

    const ChangeStatusHandler = (id, status_id) => {
        api.updateTask(parseInt(status_id), id)
            .then((result) => {
                if (result.status === 200) {
                    setTasks([
                        ...tasks.map((task) =>
                            task.id === result.data.id
                                ? (task = result.data)
                                : task
                        ),
                    ]);
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <>
        <h1 style={{
            textAlign: 'center',
            marginBottom: "30px",
        }}>Task management</h1>
            <Box>
                <form onSubmit={FormHandler} 
                style={
                    {
                        display: "flex", 
                        alignItems: "end",
                        justifyContent:"center",
                        gap:"12px",
                        marginBottom: "30px",
                    }
                }
                >
                    <TextInput label="Task name" name="name" />
                    <NativeSelect
                        data={[
                            { label: "In process", value: 1 },
                            { label: "Running", value: 2 },
                            { label: "Done", value: 3 },
                        ]}
                        name="status_id"
                        label="Status"
                    />
                    <Button variant="filled" color="green" type="submit">
                        Create Task
                    </Button>
                </form>
            </Box>

            <Table striped highlightOnHover withTableBorder withColumnBorders horizontalSpacing="xl" 
                style={{
                    width: "80%",
                    margin: "0px 10%",
                    boxShadow: "0px 0px 50px 8px rgba(0,0,0,0.1)",
                    padding: '8px',
                }}
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Status name</Table.Th>
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {tasks && tasks.length > 0 && (
                        <TableRows data={tasks} change={ChangeStatusHandler} />
                    )}
                </Table.Tbody>
            </Table>
        </>
    );
}
