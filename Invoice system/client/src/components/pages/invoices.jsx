// import { useEffect, useState } from "react";
// import { IconRefresh } from "@tabler/icons-react";
// import { notifications } from "@mantine/notifications";
// import { IconExclamationMark } from "@tabler/icons-react";
// import { Button, Loader, Pagination, rem } from "@mantine/core";
// import NewInvoiceModal from "../modals/newInvoice";
// import InvoiceItemsTable from "../utilsComponents/invoiceItemsTable";
// import * as api from "../../api/data";
// import PaginationData from "../utilsComponents/paginations";

export default function Invoices({ brand }) {
    const [invoiceData, setInvoiceData] = useState([]);
    const [openNewInvoice, setOpenNewInvoice] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loader, setLoader] = useState(true);
    const [activePage, setPage] = useState(1);
    const itemsPerPage = 3;

    const openNewInvoiceHander = () => setOpenNewInvoice(true);
    const closeNewInvoiceHander = () => setOpenNewInvoice(false);

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
                } else if (result.status === 500) {
                    notifications.show({
                        loading: false,
                        autoClose: true,
                        title: "Something went wrong..",
                        message: "Please try again or contact your vendor!",
                        color: "yellow",
                        icon: (
                            <IconExclamationMark
                                style={{ width: rem(18), height: rem(18) }}
                            />
                        ),
                    });
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

    const deletedInvoiceHander = (deletedInvoice) => {
        const ChangeData = invoiceData.map((invoices) =>
            invoices.filter((invoice) => invoice !== deletedInvoice)
        );

        if (ChangeData[activePage - 1].length === 0) {
            invoiceData.splice(activePage - 1, 1);
            setPage(activePage - 1);
            return;
        }

        const tempResult = [];
        ChangeData.map((data) => tempResult.push(...data));

        setInvoiceData(PaginationData(tempResult, itemsPerPage));
    };

    const addNewInvoice = (data) => {
        const lastIdx = invoiceData.length - 1;
        if (invoiceData.length > 0 && invoiceData[lastIdx].length + 1 <= itemsPerPage) {
            invoiceData[lastIdx].push(data);
        } else {
            if (activePage === 0) {
                setPage(activePage + 1);
            }
            invoiceData.push([data]);
        }

        setInvoiceData(invoiceData);
    };

    const UpdatedStatus = (newInvoice) => {
        const ChangeData = invoiceData.map((invoices) =>
            invoices.map((oldInvoice) =>
                oldInvoice.id == newInvoice.id ? newInvoice : oldInvoice
            )
        );
        setInvoiceData(ChangeData);
    };

    return (
        <>
            {!loader ? (
                <>
                    {openNewInvoice && (
                        <NewInvoiceModal
                            open={openNewInvoice}
                            close={closeNewInvoiceHander}
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
                                style={{
                                    maxWidth: "80px",
                                    justifyContent: "right",
                                }}
                            >
                                <IconRefresh
                                    stroke={1}
                                    size={"18px"}
                                    className="refresh-btn"
                                    onClick={() => setRefresh(true)}
                                />
                            </div>
                        </div>

                        <InvoiceItemsTable
                            invoice={
                                invoiceData.length &&
                                invoiceData[activePage - 1]
                            }
                            brand={brand}
                            deleteHandler={deletedInvoiceHander}
                            updateHandler={UpdatedStatus}
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
