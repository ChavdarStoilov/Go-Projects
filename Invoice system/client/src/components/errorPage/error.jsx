import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "./error.module.css";

export default function ErrorBoundaryPage() {
    return (
        <Container style={{margin:"15% auto"}}>
            <Title className={classes.title}>
                Something bad just happened...
            </Title>
            <Text size="lg" ta="center" className={classes.description}>
                Our client could not handle your request. <br />Please contact your vendor. <br />Try refreshing the page.
            </Text>
            <Group justify="center">
                <Button variant="white" size="md" onClick={() => window.location.reload()}>
                    Refresh the page
                </Button>
            </Group>
        </Container>
    );
}
