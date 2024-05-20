import * as api from "../../api/data";
import { Table, Box, Loader, NumberFormatter  } from "@mantine/core";
import { useEffect, useState } from "react";

export default function InvoiceTemplate({ invoiceData, brand }) {
    const [Items, setItems] = useState();
    const [loader, setLoader] = useState(true);
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
    
    const total  = Items && Items.map(item => item.amount).reduce((a, b) => a + b)

    useEffect(() => {
        api.GetInvoiceData(invoiceData.invoice_id)
            .then((result) => {
                if (result.status === 200) {
                    setItems(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoader(false);
            });
    }, []);

    const rows = Items && Items.map((element, key) => (
        <Table.Tr key={key}>
            <Table.Td>{element.id}</Table.Td>
            <Table.Td>{element.items}</Table.Td>
            <Table.Td>{element.quantity}</Table.Td>
            <Table.Td><NumberFormatter value={element.price} suffix=" лв." thousandSeparator /></Table.Td>
            <Table.Td><NumberFormatter value={element.amount} suffix=" лв." thousandSeparator /></Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            {!loader ? (
                <>
                    {" "}
                    <div className="row">
                        <div className="span8">
                            <h2>Invoice</h2>
                        </div>
                    </div>
                    <div className="invoice-details">
                        <div className="span4">
                            <p>
                                <strong>
                                    {brand[0].name}
                                </strong>
                                <br />
                                {brand[0].address}
                            </p>
                        </div>
                        <div className="span4 well">
                            <table className="invoice-head">
                                <tbody>
                                    <tr>
                                        <td className="pull-right">
                                            <strong>Customer #</strong>
                                        </td>
                                        <td>21398324797234</td>
                                    </tr>
                                    <tr>
                                        <td className="pull-right">
                                            <strong>Invoice #</strong>
                                        </td>
                                        <td>2340</td>
                                    </tr>
                                    <tr>
                                        <td className="pull-right">
                                            <strong>Date</strong>
                                        </td>
                                        <td>10-08-2013</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="span8 well invoice-body">
                            <Table
                                striped
                                withTableBorder
                                withRowBorders={false}
                            >
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>ID</Table.Th>
                                        <Table.Th>Item</Table.Th>
                                        <Table.Th>Quantity</Table.Th>
                                        <Table.Th>Price</Table.Th>
                                        <Table.Th>Amount</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{rows}</Table.Tbody>
                            </Table>
                        </div>
                    </div>
                    <div style={{textAlign: "right", marginRight: '20px'}}>
                        <strong>Total: <NumberFormatter value={total} suffix=" лв." thousandSeparator /></strong>
                    </div>
                    <div className="row">
                        <div className="span8 well invoice-thank">
                            <h5>Thank You!</h5>
                        </div>
                    </div>
                    <Box
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                            textAlign: "center",
                            marginBottom: "50px",
                        }}
                    >
                        <div className="span3">
                            <strong>Phone:</strong>+91-124-111111
                        </div>
                        <div className="span3">
                            <strong>Email:</strong>{" "}
                            <a>{brand[0].mail}</a>
                        </div>
                    </Box>
                </>
            ) : (
                <Loader color="blue"  type="dots" style={{margin: "auto", height: "458px"}}/>
            )}
        </>
    );
}
