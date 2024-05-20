import { Modal, Button, Box, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import * as api from "../../api/data";
import { useState, useEffect } from "react";
import { TextInput, NumberInput, NativeSelect, Fieldset } from "@mantine/core";
import TableNewInvoieItem from "../utilsComponents/tableNewInvoiceItem";

export default function NewInvoiceModal({ open, close, adding }) {
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState([]);
    const [clients, setClients] = useState([]);

    const removeInvoice = (row) => {
        setInvoice((invoice) => invoice.filter((item) => item !== row));
    };

    const AddNewInvoice = (event) => {
        event.preventDefault();

        const form = event.target;

        const data = Object.fromEntries(new FormData(form));

        data["price"] = parseFloat(data["price"]);
        data["quantity"] = parseInt(data["quantity"]);
        data["status"] = parseInt(data["status"]);
        data["amount"] = data["price"] * data["quantity"];
        data["owner"] = parseInt(data["owner"]);

        setInvoice((invoice) => [...invoice, data]);

        form.reset();
    };

    const CreateNewInvoice = () => {
        api.CreateNewInvoice(invoice)
            .then((result) => {
                if (result.status === 200) {
                    notifications.show({
                        loading: false,
                        autoClose: true,
                        title: "Creating was finished!",
                        message: "Record was created successfully!",
                        color: "green",
                        icon: (
                            <IconCheck
                                style={{ width: rem(18), height: rem(18) }}
                            />
                        ),
                    });

                    adding(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                close();
            });
    };

    useEffect(() => {
        api.GetAllClients()
            .then((result) => {
                if (result.status === 200) {
                    setClients(
                        ...clients,
                        result.data.map((client) => ({
                            label: `${client.first_name} ${client.last_name}`,
                            value: client.id,
                        }))
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Modal opened={open} onClose={close} size="lg">
                <Fieldset legend="Invoice information">
                    <TableNewInvoieItem data={invoice} remove={removeInvoice} />
                </Fieldset>
                <form onSubmit={AddNewInvoice}>
                    <Fieldset legend="New invoice item information">
                        <TextInput
                            radius="md"
                            label="Item"
                            placeholder="Enter a name of item"
                            required
                            name="items"
                        />
                        <NumberInput
                            label="Quantity"
                            placeholder="Enter a quantity"
                            required
                            name="quantity"
                        />
                        <NumberInput
                            label="Price"
                            placeholder="Enter a price"
                            required
                            name="price"
                            suffix=" лв."
                        />

                        <NativeSelect
                            label="Clients"
                            required
                            data={clients.length > 0 && clients}
                            name="owner"
                        />

                        <NativeSelect
                            label="Status"
                            required
                            data={[
                                { label: "Active", value: "1" },
                                { label: "Closed", value: "2" },
                                { label: "Rejected", value: "3" },
                            ]}
                            name="status"
                        />
                        <Box
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Button type="submit">Add</Button>
                            <Button
                                loading={loading}
                                loaderProps={{ type: "dots" }}
                                onClick={CreateNewInvoice}
                                disabled={invoice.length <= 0}
                            >
                                Create
                            </Button>
                        </Box>
                    </Fieldset>
                </form>
            </Modal>
        </>
    );
}
