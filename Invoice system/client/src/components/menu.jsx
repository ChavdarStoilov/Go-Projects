import { Tabs } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

export default function Menu({ brand }) {
    const navigate = useNavigate();
    const { tabValue } = useParams();

    return (
        <Tabs
            value={tabValue}
            onChange={(value) => navigate(`${value === "home" ? "" : value}/`)}
            className="sidebar"
        >
            <Tabs.List>
                <div className="sidebar-header">
                    <div className="app-icon">
                        <h2 className="brand-name">{brand && brand}</h2>
                    </div>
                </div>
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <Tabs.Tab value="home">Home</Tabs.Tab>
                    </li>
                    {brand && (
                        <>
                            <li className="sidebar-list-item active">
                                <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
                            </li>
                            <li className="sidebar-list-item">
                                <Tabs.Tab value="clients">Clients</Tabs.Tab>
                            </li>
                        </>
                    )}
                </ul>
            </Tabs.List>
        </Tabs>
    );
}
