import {
    Badge,
    Button,
    NumberFormatter,
    Modal,
    Box,
    rem,
    NativeSelect,
    Popover,
} from "@mantine/core";
import { IconQuestionMark, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import InvoiceTemplate from "./invoiceTemplate";
import * as api from "../../api/data";

export default function InvoiceItemsTable({
    invoice,
    brand,
    deleteHandler,
    updateHandler,
}) {
    const [opened, setOpen] = useState(false);
    const [openedStatus, setOpenedStatus] = useState(null);

    const Statuses = {
        Active: { id: "1", color: "yellow" },
        Completed: { id: "2", color: "green" },
        Rejected: { id: "3", color: "red" },
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

    const ChangeStatus = (e, id) => {
        const status_id = e.target.value;

        const updateNofity = notifications.show({
            title: "Updating status!",
            loading: true,
            autoClose: false,
            color: "#2187df",
            message: "Updating status starting, please wait...",
        });

        api.UpdateInvoiceStatus(id, status_id)
            .then((response) => {
                if (response.status == 200) {
                    updateHandler(response.data);
                    setOpenedStatus(null);
                    notifications.update({
                        id: updateNofity,
                        title: "Updating finished!",
                        loading: false,
                        autoClose: true,
                        color: "green",
                        icon: (
                            <IconCheck
                                style={{ width: rem(18), height: rem(18) }}
                            />
                        ),
                        message: "Statys was update successfully!",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleBadgeClick = (key) => {
        setOpenedStatus(key); // Актуализира ID на текущо отворения Popover
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
                            <Popover
                                width={300}
                                position="bottom"
                                withArrow
                                shadow="md"
                                id={`popover-${key}`}
                                opened={openedStatus === key} // Отваря Popover само за текущия запис
                                onChange={() => setOpenedStatus(null)} // Затваря Popover, когато се кликне извън него
                            >
                                <Popover.Target>
                                    <Badge
                                        variant="dot"
                                        color={Statuses[item.status]['color']}
                                        size="md"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleBadgeClick(key)} // Отваря Popover за конкретния Badge
                                    >
                                        {item.status}
                                    </Badge>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <NativeSelect
                                        label="Select status"
                                        data={[
                                            { label: "Active", value: "1" },
                                            { label: "Completed", value: "2" },
                                            { label: "Rejected", value: "3" },
                                        ]}
                                        onChange={(e) =>
                                            ChangeStatus(
                                                e,
                                                item.invoice_id,
                                                key
                                            )
                                        }
                                        value={Statuses[item.status]["id"]}
                                    />
                                </Popover.Dropdown>
                            </Popover>
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
                                onClick={() => notify(item.invoice_id, key)}
                            >
                                X
                            </span>
                        </div>
                    </div>
                ))}
        </>
    );
}
