import HomePage from "./components/homePage";
import { MantineProvider, Loader } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { Routes, Route, useLocation } from "react-router-dom";

import '@mantine/notifications/styles.css';
import "@mantine/core/styles.css";
import { useState, useEffect } from "react";
import * as api from "./api/data";
import Invoices from "./components/pages/invoices";
import Clients from "./components/pages/clients";
import NewBeandCreations from "./components/pages/newBrandCreation";
import Menu from "./components/menu";

function App() {
    const location = useLocation();
    const [brandData, setBrandData] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

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
            .finally(() => {
                setRefresh(false);
                setLoading(false);
            });
    }, [refresh]);

    return (
        <MantineProvider>
            <Notifications position="top-right" />
            {!loading ? (
                <>
                    <Menu
                        brand={
                            brandData.brandData
                                ? brandData.brandData[0].name
                                : false
                        }
                    />
                    <div className="app-content">
                        <Routes location={location} key={location.pathname}>
                            \
                            <Route
                                exact
                                path="/"
                                element={
                                    brandData.brandData ? (
                                        <HomePage
                                            brandData={brandData.brandData}
                                            counters={brandData.counters}
                                            refreshData={Data}    
                                        />
                                        
                                    ) : (
                                        <NewBeandCreations addData={Data} />
                                    )
                                }
                            />
                            <Route
                                exact
                                path="invoices/"
                                element={brandData.brandData  && <Invoices brand={brandData.brandData}/>}
                            />
                            <Route
                                exact
                                path="clients/"
                                element={brandData.brandData  && <Clients />}
                            />
                        </Routes>
                    </div>
                </>
            ) : (
                <div className="app-content">
                    <Loader
                        color="blue"
                        type="dots"
                        className="HomeLoading"
                        size={50}
                    />
                    
                </div>
            )}
        </MantineProvider>
    );
}

export default App;
