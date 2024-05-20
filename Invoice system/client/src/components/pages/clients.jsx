import { useEffect, useState } from "react";
import { Button, Loader, Pagination } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

import ClientsItemsTable from "../utilsComponents/clientsItemsTable";
import * as api from "../../api/data";
import NewClientsModal from "../modals/newClients";
import PaginationData from "../utilsComponents/paginations";

export default function Clients() {
    const [clientsData, setClientsData] = useState([]);
    const [openNewClients, setOpenNewClients] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loader, setLoader] = useState(true);
    const [activePage, setPage] = useState(1);

    const itemsPerPage = 3;

    const openNewClientsHander = () => setOpenNewClients(true);
    const closeNewClientsHander = () => setOpenNewClients(false);

    const addHandler = (data) => {
        const lastIdx = clientsData.length - 1;

        if (clientsData[lastIdx].length + 1 <= itemsPerPage) {
            clientsData[lastIdx].push(data);
        } else {
            clientsData.push([data]);
        }

        setClientsData(clientsData);
    }

    const updateClients = (newData) => {
        setClientsData(
            clientsData.map((client) =>
                client.id === newData.id ? (client = newData) : client
            )
        );
    };

    const deletedClientHander = (deletedClient) => {
        const ChangeData = clientsData.map((clients) =>
            clients.filter((client) => client !== deletedClient)
        );

        if (ChangeData[activePage - 1].length === 0) {
            clientsData.splice(activePage - 1, 1);
            setPage(activePage - 1);
            return;
        }

        const tempResult = [];
        ChangeData.map((data) => tempResult.push(...data));

        setClientsData(PaginationData(tempResult, itemsPerPage));
    };

    useEffect(() => {
        api.GetAllClients()
            .then((result) => {
                if (result.status === 200) {
                    if (result.data !== null) {
                        setClientsData(
                            PaginationData(result.data, itemsPerPage)
                        );
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoader(false);
                setRefresh(false);
            });
    }, [refresh]);

    return (
        <>
            {!loader ? (
                <>
                    {openNewClients && (
                        <NewClientsModal
                            open={openNewClients}
                            close={closeNewClientsHander}
                            add={addHandler}
                        />
                    )}
                    <div className="app-content-header">
                        <h1>Clients</h1>
                        <Button variant="filled" onClick={openNewClientsHander}>
                            Add New Clients
                        </Button>
                    </div>
                    <div className="products-area-wrapper tableView">
                        <div className="products-header">
                            <div className="product-cell">ID</div>
                            <div className="product-cell">First name</div>
                            <div className="product-cell">Last Name</div>
                            <div className="product-cell">Phone</div>
                            <div className="product-cell"></div>
                            <div
                                className="product-cell"
                                style={{ maxWidth: "80px" }}
                            ><IconRefresh
                            stroke={1}
                            size={"18px"}
                            className="refresh-btn"
                            onClick={() => setRefresh(true)}
                        /></div>
                        </div>

                        <ClientsItemsTable
                            clients={
                                clientsData.length &&
                                clientsData[activePage - 1]
                            }
                            deleteHander={deletedClientHander}
                            update={updateClients}
                        />
                    </div>
                    <Pagination
                        total={clientsData.length ? clientsData.length : 1}
                        value={activePage}
                        onChange={setPage}
                        size="sm"
                        radius="lg"
                    />
                </>
            ) : (
                <Loader color="blue" type="dots" className="loader" size={50} />
            )}
        </>
    );
}
