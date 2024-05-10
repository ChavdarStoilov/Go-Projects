import { Table, Badge } from "@mantine/core";

export default function TableNewInvoieItem({ data, remove }) {
    const Statuses = {
        1: ["Active", "yellow"],
        2: ["Completed", "green"],
        3: ["Rejected", "red"],
    };
    
    const rows = data.map((element, key) => (
        <Table.Tr key={key}>
            <Table.Td>{element.items}</Table.Td>
            <Table.Td>{element.quantity}</Table.Td>
            <Table.Td>{element.price}</Table.Td>
            <Table.Td>{element.amount}</Table.Td>
            <Table.Td>
                <Badge
                    variant="dot"
                    color={Statuses[element.status][1]}
                    size="md"
                >
                    {Statuses[element.status][0]}
                </Badge>
            </Table.Td>
            <Table.Td>
                <p style={{cursor: "pointer", color: "Red"}} onClick={() => remove(data[key])}>x</p>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Item</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Price</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </>
    );
}
