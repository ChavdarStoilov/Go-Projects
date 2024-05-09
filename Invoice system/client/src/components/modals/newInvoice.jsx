import { Modal, Button, Box } from "@mantine/core";
import * as api from "../../api/data";
import { useState } from "react";
import { TextInput, NumberInput, NativeSelect } from "@mantine/core";
import TableNewInvoieItem from "../utilsComponents/tableNewInvoiceItem";

export default function NewInvoiceModal({ open, close }) {
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState([]);

    const removeInvoice = (row) => {

        setInvoice((invoice) => invoice.filter( item => item !== row));

    }

    const AddNewInvoice = (event) => {
        event.preventDefault();

        const form = event.target;

        const data = Object.fromEntries(new FormData(form));

        data["price"] = parseFloat(data["price"]);
        data["quantity"] = parseInt(data["quantity"])
        data['status']= parseInt(data["status"])
        data["amount"] = data["price"]* data["quantity"];

        setInvoice((invoice) => [...invoice, data]);

        form.reset();
    };

    
    const CreateNewInvoice = () => {

        api.CreateNewInvoice(invoice)
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(result);
        })
    }

    return (
        <>
            <Modal opened={open} onClose={close} title="New Invoice">
                <TableNewInvoieItem data={invoice} remove={removeInvoice} />

                <form onSubmit={AddNewInvoice}>
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
                            onClick={CreateNewInvoice}
                            disabled={invoice.length <= 0}
                        >
                            Create
                        </Button>
                    </Box>
                </form>
            </Modal>
        </>
    );
}
