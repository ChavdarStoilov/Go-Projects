import { Modal, Button, Box, TextInput, Fieldset,rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import * as api from "../../api/data";

export default function NewClientsModal({ open, close, add }) {
    const CreateNewClient = (event) => {
        event.preventDefault();

        const form = event.target;

        const data = Object.fromEntries(new FormData(form));

        api.CreateNewClient(data)
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
                    add(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                close();
            });

        form.reset();
    };

    return (
        <Modal opened={open} onClose={close}>
            <form onSubmit={CreateNewClient}>
                <Fieldset legend="New client information">
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
                </Fieldset>
            </form>
        </Modal>
    );
}
