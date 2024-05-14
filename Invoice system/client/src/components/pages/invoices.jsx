import { useEffect, useState } from "react";
import { Button, Loader, Pagination } from "@mantine/core";
import NewInvoiceModal from "../modals/newInvoice";
import InvoiceItemsTable from "../utilsComponents/invoiceItemsTable";
import * as api from "../../api/data";
import PaginationData from "../utilsComponents/paginations"



export default function Invoices({ brand }) {
    const [invoiceData, setInvoiceData] = useState(false);
    const [openNewInvoice, setOpenNewInvoice] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loader, setLoader] = useState(true);
    const [activePage, setPage] = useState(1);
    const [data, setData] = useState([]);
    const itemsPerPage = 2;

    const openNewInvoiceHander = () => setOpenNewInvoice(true);
    const closeNewInvoiceHander = () => setOpenNewInvoice(false);

    const refreshHander = () => setRefresh(true);

    useEffect(() => {
        api.GetAllInvoices()
            .then((result) => {
                if (result.status === 200) {
                    setInvoiceData(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoader(false);
                setData(PaginationData(invoiceData, itemsPerPage))
            });
    }, [refresh]);

    

    return (
        <>
            {!loader ? (
                <>
                    {openNewInvoice && (
                        <NewInvoiceModal
                            open={openNewInvoice}
                            close={closeNewInvoiceHander}
                            refreshing={refreshHander}
                        />
                    )}
                    <div className="app-content-header">
                        <h1>Invoices</h1>
                        <Button variant="filled" onClick={openNewInvoiceHander}>
                            Add New Invoice
                        </Button>
                    </div>
                    <div className="products-area-wrapper tableView">
                        <div className="products-header">
                            <div className="product-cell">ID</div>
                            <div className="product-cell status-cell">
                                Status
                            </div>
                            <div className="product-cell price">Cusotmer</div>
                            <div className="product-cell price">Amount</div>
                            <div className="product-cell price"></div>
                        </div>

                        <InvoiceItemsTable
                            invoice={data && data[activePage - 1]}
                            brand={brand}
                        />
                    </div>
                    <Pagination
                        total={invoiceData.slice(itemsPerPage).length}
                        value={activePage}
                        onChange={setPage}
                        mt="xl"
                    />
                </>
            ) : (
                <Loader color="blue" type="dots" className="loader" size={50} />
            )}
        </>
    );
}
