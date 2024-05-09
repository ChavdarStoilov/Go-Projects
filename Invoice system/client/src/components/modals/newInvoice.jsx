import { Modal, Button, Box } from "@mantine/core";
import * as api from "../../api/data";
import { useState } from "react";
import { TextInput, NumberInput, NativeSelect } from "@mantine/core";
import TableNewInvoieItem from "../utilsComponents/tableNewInvoiceItem";

export default function NewInvoiceModal({ open, close }) {
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState([]);

    const CreateNewInvoice = (event) => {
        event.preventDefault();

        const form = event.target;

        const data = Object.fromEntries(new FormData(form));

        data["amount"] = parseInt(data["price"]) * parseInt(data["quantity"]);

        setInvoice((invoice) => [...invoice, data]);

        form.reset();
    };

    return (
        <>
            <Modal opened={open} onClose={close} title="New Invoice">
                <TableNewInvoieItem data={invoice} />

                <form onSubmit={CreateNewInvoice}>
                    <TextInput
                        radius="md"
                        label="Item"
                        placeholder="Enter a name of item"
                        required
                        name="item"
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
                        label="Status"
                        required
                        data={[
                            { label: "Active", value: "1" },
                            { label: "Closed", value: "2" },
                            { label: "Rejected", value: "3" },
                        ]}
                        name="status"
                    />
                    <Box style={{marginTop: "20px", display:"flex", justifyContent: "space-evenly"}}>
                        <Button type="submit">Add</Button>
                        <Button
                            loading={loading}
                            loaderProps={{ type: "dots" }}
                            onClick={() => console.log(invoice)}
                        >
                            Create
                        </Button>
                    </Box>
                </form>
            </Modal>
        </>
    );
}
