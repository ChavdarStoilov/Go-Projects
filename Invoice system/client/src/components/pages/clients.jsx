import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import ClientsItemsTable from "../utilsComponents/clientsItemsTable";
import * as api from "../../api/data";
import NewClientsModal from "../modals/newClients";


export default function Clients() {
    const [clientsData, setClientsData] = useState({});
    const [openNewClients, setOpenNewClients] = useState(false);

    const openNewClientsHander = () => setOpenNewClients(true);
    const closeNewClientsHander = () => setOpenNewClients(false);

    useEffect(() => {
        api.GetAllClients()
            .then((result) => {
                if (result.status === 200) {
                    setClientsData(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            {openNewClients && <NewClientsModal open={openNewClients} close={closeNewClientsHander}/>}
            <div className="app-content-header">
                <h1>Clients</h1>
                <Button variant="filled" onClick={openNewClientsHander}>Add New Clients</Button>
            </div>
            <div className="products-area-wrapper tableView">
                <div className="products-header">
                    <div className="product-cell">ID</div>
                    <div className="product-cell">First name</div>
                    <div className="product-cell">Last Name</div>
                    <div className="product-cell">Phone</div>
                    <div className="product-cell"></div>
                </div>

                <ClientsItemsTable clients={clientsData}/>
            </div>
        </>
    );
}
