import { Text, Paper, Box } from "@mantine/core";
import CountUp from 'react-countup';

export default function HomePage({ counters }) {
    return (
        <>
            <div className="app-content-header">
                <h1>Home</h1>
            </div>
            <Box className="statisctics">
                <Paper shadow="xl" radius="md" withBorder p="xl">
                    <Text className="title">Clients</Text>
                    <Text className="number">
                        <CountUp start={0} end={counters.client_counter} duration={5} />
                    </Text>
                </Paper>
                <Paper shadow="xl" radius="md" withBorder p="xl">
                    <Text className="title">Invoices</Text>
                    <Text className="number">
                        <CountUp start={0} end={counters.invoice_counter} duration={5} />
                    </Text>
                </Paper>
            </Box>
        </>
    );
}
