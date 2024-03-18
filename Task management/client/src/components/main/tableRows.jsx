import { Table } from "@mantine/core";
import { NativeSelect, Pagination, Button  } from "@mantine/core";
import { useState } from "react";
import * as api from "../../api/api.v1"

export default function TableRows({ data, change, update }) {
    const [activePage, setPage] = useState(1);

    function chunk(array, size) {
        if (!array.length) {
            return [];
        }
        const head = array.slice(0, size);
        const tail = array.slice(size);
        return [head, ...chunk(tail, size)];
    }

    const Pages = chunk(
        data.map((row) => row),
        10
    );

    const deleteHandler = (id) => {
        console.log(id);
        api.deleteTask(parseInt(id))
        .then((result) => {
            if (result.status === 200) {
                update(data.filter(task => task.id !== result.data.id));
            };
        })
        .catch((err) => {
            console.log(err);
        });

    }

    const items = Pages[activePage - 1].map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td style={{
                display: "flex",
                justifyContent:"center",
            }}>
                <NativeSelect
                    data={[
                        { label: "In process", value: 1 },
                        { label: "Running", value: 2 },
                        { label: "Done", value: 3 },
                    ]}
                    value={item.status_id}
                    onChange={(e) => change(item.id, e.currentTarget.value)}
                    style={{
                        width: "120px",
                    }}
                />
            </Table.Td>
            <Table.Td style={{
                textAlign: "center",
            }}>
                <Button
                    variant="outline"
                    color="rgba(255, 0, 0, 1)"
                    radius="xl"
                    onClick={() => deleteHandler(item.id)}
                >
                    Delete
                </Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            {items}
            <Pagination
                total={Pages.length}
                value={activePage}
                onChange={setPage}
                mt="sm"
                style={{
                    margin: "8px",
                }}
            />
        </>
    );
}
