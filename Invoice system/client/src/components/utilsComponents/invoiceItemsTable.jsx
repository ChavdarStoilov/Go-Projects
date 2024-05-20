import { Badge, Button, NumberFormatter, Modal, Box, rem } from "@mantine/core";
import { IconQuestionMark, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import InvoiceTemplate from "./invoiceTemplate";
import * as api from "../../api/data";

const defaultMsg = {
    status: false,
    title: "Are you sure?",
    message: "Default",
};

export default function InvoiceItemsTable({ invoice, brand, deleteHandler }) {
    const [opened, setOpen] = useState(false);

    const Statuses = {
        active: "yellow",
        completed: "green",
        rejected: "red",
    };

    const notify = (id, key) => {
        const idNotify = notifications.show({
            title: "Are you sure you want to delete it!",
            color: "red",
            icon: <IconQuestionMark />,

            message: (
                <>
                    <Box
                        style={{
                            display: "flex",
                            gap: "20px",
                            marginTop: "20px",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            onClick={() => deleteInvoice(id, key, idNotify)}
                        >
                            Yes
                        </Button>
                        <Button onClick={() => notifications.hide(idNotify)}>
                            No
                        </Button>
                    </Box>
                </>
            ),
        });
    };

    const deleteInvoice = (id, key, idNotify) => {
        notifications.update({
            id: idNotify,
            title: "Deleting record!",
            loading: true,
            autoClose: false,
            color: "#2187df",
            message: "Deleting record starting, please wait...",
        });

        api.DeleteInvoice(id)
            .then((result) => {
                if (result.status === 200 && result.data === "Deleted") {
                    deleteHandler(invoice[key]);
                    notifications.update({
                        id: idNotify,
                        title: "Deleting finished!",
                        loading: false,
                        autoClose: true,
                        color: "green",
                        icon: (
                            <IconCheck
                                style={{ width: rem(18), height: rem(18) }}
                            />
                        ),
                        message: "Record was deleted successfully!",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            {opened[0] && (
                <Modal
                    opened={opened[0]}
                    onClose={() => setOpen(false)}
                    size="lg"
                >
                    <InvoiceTemplate
                        invoiceData={invoice[opened[1]]}
                        brand={brand}
                    />
                    <Box
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Box>
                </Modal>
            )}

            {invoice.length > 0 &&
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
                                onClick={() => setOpen([true, key])}
                            >
                                Open Invoice
                            </Button>
                        </div>
                        <div
                            className="product-cell"
                            style={{ maxWidth: "80px" }}
                        >
                            <span
                                style={{ cursor: "pointer", color: "red" }}
                                onClick={() =>
                                    notify(item.invoice_id, key)
                                }
                            >
                                X
                            </span>
                        </div>
                    </div>
                ))}
        </>
    );
}
