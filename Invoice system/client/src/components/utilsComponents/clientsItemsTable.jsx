import { Button, Modal, TextInput, Box } from "@mantine/core";
import { useState } from "react";
import * as api from "../../api/data";

export default function ClientsItemsTable({ clients, deleteHander, update}) {
    const [opened, setOpen] = useState(false);

    const deleteClient = (id, key) => {
        api.DeleteClient(id)
            .then((result) => {
                if (result.status === 200 && result.data === "Deleted") {
                    console.log(clients[key]);
                    deleteHander(clients[key]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateClient = (e) => {
        e.preventDefault();

        const form = e.target;

        const data = Object.fromEntries(new FormData(form));

        data["id"] = clients[opened[1]].id, data

        api.UpdateClient(data)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                logger.error(error);
            })
            .finally(() => {
                update(data);
                setOpen(false);
            });
    };

    return (
        <>
            {opened[0] && (
                <Modal
                    opened={opened[0]}
                    onClose={() => setOpen(false)}
                    title="Client details"
                >
                    <form onSubmit={updateClient}>
                        <TextInput
                            label="First name"
                            required
                            defaultValue={clients[opened[1]].first_name}
                            name="first_name"
                        />
                        <TextInput
                            label="Last name"
                            required
                            defaultValue={clients[opened[1]].last_name}
                            name="last_name"
                        />
                        <TextInput
                            label="Phone"
                            required
                            defaultValue={clients[opened[1]].phone}
                            name="phone"
                        />
                        <Box
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Button type="submit">Save</Button>
                            <Button onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </Box>
                    </form>
                </Modal>
            )}

            {clients.length > 0 &&
                clients.map((item, key) => (
                    <div className="products-row" key={key}>
                        <div className="product-cell">
                            <span>{item.id}</span>
                        </div>
                        <div className="product-cell">
                            <span>{item.first_name}</span>
                        </div>
                        <div className="product-cell">
                            <span>{item.last_name}</span>
                        </div>
                        <div className="product-cell">
                            <span>{item.phone}</span>
                        </div>

                        <div className="product-cell">
                            <Button
                                variant="gradient"
                                size="compact-sm"
                                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                                onClick={() => setOpen([true, key])}
                            >
                                Open client
                            </Button>
                        </div>
                        <div
                            className="product-cell"
                            style={{ maxWidth: "80px" }}
                        >
                            <span
                                style={{ cursor: "pointer", color: "red" }}
                                onClick={() => deleteClient(item.id, key)}
                            >
                                X
                            </span>
                        </div>
                    </div>
                ))}
        </>
    );
}
