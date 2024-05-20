import {
    Badge,
    Button,
    NumberFormatter,
    Modal,
    Box,
    Notification,
    Transition,
    rem
} from "@mantine/core";
import { IconCheck } from '@tabler/icons-react';
import { useState } from "react";
import InvoiceTemplate from "./invoiceTemplate";
import * as api from "../../api/data";

const defaultMsg = {
    status: false,
    title: "Are you sure?",
    message: "Default",
}

export default function InvoiceItemsTable({ invoice, brand, deleteHandler }) {
    const [notify, setNofity] = useState(false);
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;


    const [notifyLoader, setNofityLoader] = useState(defaultMsg);

    const Statuses = {
        active: "yellow",
        completed: "green",
        rejected: "red",
    };
    const [opened, setOpen] = useState(false);

    const deleteInvoice = (id, key) => {
        setNofityLoader({
            status: true,
            title: "Loading...",
            message: "Record deletion starting...",
        });

        api.DeleteInvoice(id)
            .then((result) => {
                if (result.status === 200 && result.data === "Deleted") {
                    setNofityLoader({
                        status: false,
                        title: "All good!",
                        message: "Record deleted successfully!",
                        color: "green",
                    });

                    deleteHandler(invoice[key]);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setTimeout(() => {
                    setNofity(false);
                    setNofityLoader(defaultMsg);
                }, 1200);
            });
    };

    return (
        <>
            <Transition
                mounted={notify[0]}
                transition="slide-left"
                duration={400}
                timingFunction="ease"
            >
                {(styles) => (
                    <Notification
                        color={notifyLoader.title === "All good!" ? notifyLoader.color : "red"}
                        title={notifyLoader.title}
                        className="deleteNofify"
                        radius="md"
                        style={styles}
                        loading={notifyLoader.status}
                        onClose={() => setNofity(false)}
                        icon={notifyLoader.title === "All good!" && checkIcon}
                    >
                        {notifyLoader.message === "Default" ? (
                            <Box
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    marginTop: "20px",
                                }}
                            >
                                <Button
                                    onClick={() =>
                                        deleteInvoice(notify[1], notify[2])
                                    }
                                >
                                    Yes
                                </Button>
                                <Button onClick={() => setNofity(false)}>
                                    No
                                </Button>
                            </Box>
                        ) : (
                            notifyLoader.message
                        )}
                    </Notification>
                )}
            </Transition>
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
                                    setNofity([true, item.invoice_id, key])
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
