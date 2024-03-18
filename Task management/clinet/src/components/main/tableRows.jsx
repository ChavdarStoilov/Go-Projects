import { Table } from "@mantine/core";
import { NativeSelect, Pagination } from "@mantine/core";
import { useState } from "react";

export default function TableRows({ data, change }) {
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
    
    
    const items = Pages[activePage - 1].map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td>
                <NativeSelect
                    data={[
                        { label: "In process", value: 1 , },
                        { label: "Running", value: 2 },
                        { label: "Done", value: 3 },
                    ]}
                    value={item.status_id}
                    onChange={(e) => change(item.id, e.currentTarget.value)}
                />
            </Table.Td>
        </Table.Tr>
    ));


    return (
        <>
            {items}
            {/* {data &&
                data.map((row) => (
                    <Table.Tr key={row.id}>
                        <Table.Td>{row.name}</Table.Td>
                        <Table.Td>
                            <NativeSelect
                                data={[
                                    { label: "In process", value: 1 },
                                    { label: "Running", value: 2 },
                                    { label: "Done", value: 3 },
                                ]}
                                value={row.status_id}
                                onChange={(e) =>
                                    change(row.id, e.currentTarget.value)
                                }
                            />
                        </Table.Td>
                    </Table.Tr>
                ))} */}
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
