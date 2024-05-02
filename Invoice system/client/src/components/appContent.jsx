import { Button } from "@mantine/core";
import Invoices from "./pages/invoices";
import { Tabs } from "@mantine/core";

export default function AppContent({ pageName }) {
    return (
        <div className="app-content">
            <div className="app-content-header">
                <h1 className="app-content-headerText">{pageName}</h1>
                {pageName === "invoices" && (
                    <Button variant="light" radius="lg">
                        Add Invoice
                    </Button>
                )}
            </div>
            <Tabs.Panel value="home">Home panel</Tabs.Panel>
            <Tabs.Panel value="invoices">
                <Invoices />
            </Tabs.Panel>
            <Tabs.Panel value="clients">Client panel</Tabs.Panel>
        </div>
    );
}
