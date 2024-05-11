import { Modal, Button, Box, TextInput } from "@mantine/core";
import * as api from "../../api/data"

export default function NewClientsModal({open, close}) {

    const CreateNewClient = (event) => {

        event.preventDefault();

        const form = event.target

        const data = Object.fromEntries(new FormData(form));

        api.CreateNewClient(data)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        });

        form.reset();
    }

    return (
        <Modal opened={open} onClose={close} title="New Client">
            <form onSubmit={CreateNewClient}>
                <TextInput
                    radius="md"
                    label="First Name"
                    placeholder="Enter a first name"
                    required
                    name="first_name"
                />
                <TextInput
                    label="Last Name"
                    placeholder="Enter a last name"
                    required
                    name="last_name"
                />
                <TextInput
                    label="Phone Number"
                    placeholder="Enter a phone number"
                    required
                    name="phone"
                    suffix=" лв."
                />
                <Box
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "space-evenly",
                    }}
                >
                    
                    <Button
                        // loading={loading}
                        loaderProps={{ type: "dots" }}
                        type="submit"
                    >
                        Create
                    </Button>
                </Box>
            </form>
        </Modal>
    );
}