import { Tabs } from "@mantine/core";

export default function Menu() {
    return (
        <Tabs.List className="sidebar">
            <div className="sidebar-header">
                <div className="app-icon">
                    <h2 className="brand-name">Brand Name</h2>
                </div>
            </div>
            <ul className="sidebar-list">
                <li className="sidebar-list-item">
                    <Tabs.Tab value="home">Home</Tabs.Tab>
                </li>
                <li className="sidebar-list-item active">
                    <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
                </li>
                <li className="sidebar-list-item">
                    <Tabs.Tab value="clients">Clients</Tabs.Tab>
                </li>
            </ul>
        </Tabs.List>
    );
}
