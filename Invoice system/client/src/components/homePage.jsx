import { useState, useEffect } from "react";
import * as api from "../api/data.js";
import Menu from "./menu.jsx";
import AppContent from "./appContent.jsx";
import { Tabs } from "@mantine/core";

export default function HomePage() {
    const [brandData, setBrandData] = useState(false);
    const [page, setPage] = useState("home");
    const [refresh, setRefresh] = useState(false);

    const Data = () => setRefresh(true);

    useEffect(() => {
        api.GetBrandData()
            .then((result) => {
                if (result.status === 200 && result.data !== null) {
                    setBrandData(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => setRefresh(false));
    }, [refresh]);

    return (
        <Tabs value={page} onChange={setPage} className="app-container">
            <Menu brand={brandData ? brandData[0].name : false} />
            <AppContent pageName={page} brand={brandData} addData={Data}/>
        </Tabs>
    );
}
