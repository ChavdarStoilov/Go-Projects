import {
    Badge,
    Button,
    NumberFormatter,
    TextInput,
    Modal,
    Box,
} from "@mantine/core";
import { useState } from "react";
import InvoiceTemplate from "./invoiceTemplate"

export default function InvoiceItemsTable({ invoice }) {
    const Statuses = {
        active: "yellow",
        completed: "green",
        rejected: "red",
    };
    const [opened, setOpen] = useState(false);

    return (
        <>
            {opened[0] && (
                <Modal
                    opened={opened[0]}
                    onClose={() => setOpen(false)}
                    title="Invoice details"
                >
                    <InvoiceTemplate invoiceData={invoice[opened[1]]}/>
                    <Box
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Button>Save</Button>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Box>
                </Modal>
            )}

            {invoice &&
                invoice.map((item, key) => (
                    <div className="products-row" key={key}>
                        <div className="product-cell">
                            <span>{item.invoice_id}</span>
                        </div>
                        <div className="product-cell status-cell">
                            <Badge
                                variant="dot"
                                color={Statuses[item.status]}
                                size="md"
                            >
                                {item.status}
                            </Badge>
                        </div>
                        <div className="product-cell">
                            <span>
                                {item.first_name} {item.last_name}
                            </span>
                        </div>
                        <div className="product-cell price">
                            <NumberFormatter
                                value={item.amount}
                                suffix=" лв."
                                thousandSeparator
                            />
                        </div>

                        <div className="product-cell">
                            <Button
                                variant="gradient"
                                size="compact-sm"
                                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                                onClick={() => setOpen([true, item.invoice_id])}
                            >
                                Open Invoice
                            </Button>
                        </div>
                    </div>
                ))}
        </>
    );
}
