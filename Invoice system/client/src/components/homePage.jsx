import { useState, useEffect } from "react";
import * as api from "../api/data.js";
import Menu from "./menu.jsx";
import AppContent from "./appContent.jsx";

export default function HomePage() {
    const [brandData, setBrandData] = useState(false);

    useEffect(() => {
        api.GetBrandData()
            .then((result) => {
                if (result.status === 200 && result.data !== null) {
                    setBrandData(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <main className="app-container">
            <Menu />
            <AppContent />
        </main>
    );
}
