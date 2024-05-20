import { useEffect, useState } from "react";
import { Button, Loader, Pagination } from "@mantine/core";
import NewInvoiceModal from "../modals/newInvoice";
import InvoiceItemsTable from "../utilsComponents/invoiceItemsTable";
import * as api from "../../api/data";
import PaginationData from "../utilsComponents/paginations";

export default function Invoices({ brand }) {
    const [invoiceData, setInvoiceData] = useState([]);
    const [openNewInvoice, setOpenNewInvoice] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loader, setLoader] = useState(true);
    const [activePage, setPage] = useState(1);
    const itemsPerPage = 3;

    const openNewInvoiceHander = () => setOpenNewInvoice(true);
    const closeNewInvoiceHander = () => setOpenNewInvoice(false);

    const refreshHander = () => setRefresh(true);

    const deletedInvoiceHander = (deletedInvoice) => {
        const ChangeData = invoiceData.map((invoices) =>
            invoices.filter((invoice) => invoice !== deletedInvoice)
        );

        if (ChangeData[activePage - 1].length === 0) {
            invoiceData.splice(activePage - 1, 1);
            setPage(activePage - 1);
            return;
        }

        setInvoiceData(ChangeData);
    };

    const addNewInvoice = (data) => {
        invoiceData.map((invoiceRow, key) => key === invoiceData.length  && invoiceRow.length + 1 <= itemsPerPage ? invoiceRow.push(data) : invoiceData.push([data]))
        // setInvoiceData([invoiceData, ...data]);
    };

    useEffect(() => {
        api.GetAllInvoices()
            .then((result) => {
                if (result.status === 200) {
                    setInvoiceData(
                        PaginationData(
                            result.data.length && result.data,
                            itemsPerPage
                        )
                    );
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
                    {openNewInvoice && (
                        <NewInvoiceModal
                            open={openNewInvoice}
                            close={closeNewInvoiceHander}
                            refreshing={refreshHander}
                            adding={addNewInvoice}
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
                            <div className="product-cell">Cusotmer</div>
                            <div className="product-cell">Amount</div>
                            <div className="product-cell"></div>
                            <div
                                className="product-cell"
                                style={{ maxWidth: "80px" }}
                            ></div>
                        </div>

                        <InvoiceItemsTable
                            invoice={
                                invoiceData.length &&
                                invoiceData[activePage - 1]
                            }
                            brand={brand}
                            deleteHandler={deletedInvoiceHander}
                        />
                    </div>
                    <Pagination
                        total={invoiceData.length ? invoiceData.length : 1}
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
