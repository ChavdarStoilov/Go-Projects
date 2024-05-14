import { useEffect, useState } from "react";
import { Button, Loader, Pagination } from "@mantine/core";
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

    const [data, setData] = useState([]);
    const itemsPerPage = 2;

    const openNewClientsHander = () => setOpenNewClients(true);
    const closeNewClientsHander = () => setOpenNewClients(false);

    const refreshHander = () => setRefresh(true);

    useEffect(() => {
        api.GetAllClients()
            .then((result) => {
                if (result.status === 200) {
                    setClientsData(result.data);
                    setData(PaginationData(result.data.length && result.data, itemsPerPage))
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoader(false);
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
                            refreshing={refreshHander}
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
                            <div className="product-cell" style={{ maxWidth: "80px" }}></div>

                        </div>

                        <ClientsItemsTable
                            clients={data.length && data[activePage - 1]}
                        />
                    </div>
                    <Pagination
                        total={clientsData.slice(itemsPerPage).length}
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
