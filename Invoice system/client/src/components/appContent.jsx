import { Button } from "@mantine/core";
import Invoices from "./pages/invoices";
import { Tabs } from "@mantine/core";
import NewBeandCreations from "./pages/newBrandCreation";

export default function AppContent({ pageName, brand, addData }) {
    return (
        <div className="app-content">
            <div className="app-content-header">
                <h1 className="app-content-headerText">{!brand && pageName == "home"? "Creation new brand" : pageName}</h1>
                {pageName === "invoices" && (
                    <Button variant="light" radius="lg">
                        Add Invoice
                    </Button>
                )}
            </div>
            <Tabs.Panel value="home">{
                brand ? "Home page"  : <NewBeandCreations addData={addData}/>
            }</Tabs.Panel>
            <Tabs.Panel value="invoices">
                <Invoices/>
            </Tabs.Panel>
            <Tabs.Panel value="clients">Client panel</Tabs.Panel>
        </div>
    );
}
