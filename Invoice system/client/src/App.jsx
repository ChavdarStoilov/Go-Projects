"use client";

import HomePage from "./components/homePage";
import { MantineProvider, Loader, rem } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Routes, Route, useLocation } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconExclamationMark } from "@tabler/icons-react";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import { useState, useEffect } from "react";
import * as api from "./api/data";
import Invoices from "./components/pages/invoices";
import Clients from "./components/pages/clients";
import NewBeandCreations from "./components/pages/newBrandCreation";
import Menu from "./components/menu";
import ErrorBoundaryPage from "./components/errorPage/error";

import { ErrorBoundary } from "react-error-boundary";

function App() {
    const location = useLocation();
    const [brandData, setBrandData] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const Data = () => setRefresh(true);

    useEffect(() => {
        api.GetBrandData()
            .then((result) => {
                if (result.status === 200 && result.data !== null) {
                    setBrandData(result.data);
                } else if (result.status === 500) {
                    notifications.show({
                        loading: false,
                        autoClose: true,
                        title: "Something went wrong..",
                        message: `${result.data}, please contact your support.`,
                        color: "red",
                        icon: (
                            <IconExclamationMark
                                style={{ width: rem(18), height: rem(18) }}
                            />
                        ),
                    });
                    setError(true);
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

    const logError = (error, request) => {

        const data = {
            description : error
        }

        request(data)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    };

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
                                        <ErrorBoundary
                                            FallbackComponent={
                                                ErrorBoundaryPage
                                            }
                                            onError={(error) =>
                                                logError(
                                                    `${error.message} on Home component!`, api.ErrorHandlerBrand
                                                )
                                            }
                                        >
                                            <HomePage
                                                brandData={brandData.brandData}
                                                counters={brandData.counters}
                                                refreshData={Data}
                                            />
                                        </ErrorBoundary>
                                    ) : (
                                        !error && (
                                            <NewBeandCreations addData={Data} />
                                        )
                                    )
                                }
                            />
                            <Route
                                exact
                                path="invoices/"
                                element={
                                    brandData.brandData && (
                                        <ErrorBoundary
                                            FallbackComponent={
                                                ErrorBoundaryPage
                                            }
                                            onError={(error) =>
                                                logError(
                                                    `${error.message} on Invoice component!`, api.ErrorHandlerInvoice
                                                )
                                            }
                                        >
                                            <Invoices
                                                brand={brandData.brandData}
                                            />
                                        </ErrorBoundary>
                                    )
                                }
                            />
                            <Route
                                exact
                                path="clients/"
                                element={
                                    brandData.brandData && (
                                        <ErrorBoundary
                                            FallbackComponent={
                                                ErrorBoundaryPage
                                            }
                                            onError={(error) =>
                                                logError(
                                                    `${error.message} on Clients component!`, api.ErrorHandlerInvoice
                                                )
                                            }
                                        >
                                            <Clients />
                                        </ErrorBoundary>
                                    )
                                }
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
