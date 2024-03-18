import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Button, Group, Box, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Login() {
    const [visible, { toggle }] = useDisclosure(false);

    const FormHaldner = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <Box pos="relative" maw={340} mx="auto">
                <LoadingOverlay
                    visible={visible}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />
                <form onSubmit={FormHaldner}>
                    <TextInput
                        label="Username"
                        placeholder="Enter your username!"
                    />
                    <TextInput
                        mt="md"
                        label="Password"
                        placeholder="Enter your password!"
                        type="password"
                    />

                    <Button onClick={toggle} type="submit">Login</Button>
                </form>
            </Box>
        </>
    );
}
