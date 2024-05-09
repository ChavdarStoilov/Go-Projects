import { useEffect, useState } from "react";
import { Badge, Button, NumberFormatter } from "@mantine/core";
import NewInvoiceModal from "../modals/newInvoice";
import * as api from "../../api/data";

export default function Invoices() {
    const [invoiceData, setInvoiceData] = useState({});
    const [openNewInvoice, setOpenNewInvoice] = useState(false);

    const openNewInvoiceHander = () => setOpenNewInvoice(true);
    const closeNewInvoiceHander = () => setOpenNewInvoice(false);

    useEffect(() => {
        api.GetAllInvoices()
            .then((result) => {
                if (result.status === 200) {
                    setInvoiceData(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            {openNewInvoice && <NewInvoiceModal open={openNewInvoice} close={closeNewInvoiceHander}/>}
            <div className="app-content-header">
                <h1>Invoices</h1>
                <Button variant="filled" onClick={openNewInvoiceHander}>Add New Invoice</Button>
            </div>
            <div className="products-area-wrapper tableView">
                <div className="products-header">
                    <div className="product-cell">ID</div>
                    <div className="product-cell status-cell">Status</div>
                    <div className="product-cell price">Cusotmer</div>
                    <div className="product-cell price">Amount</div>
                    <div className="product-cell price"></div>
                </div>

                <div className="products-row">
                    <div className="product-cell">
                        <span>0000001</span>
                    </div>
                    <div className="product-cell status-cell">
                        <Badge variant="dot" color="green" size="md">
                            Active
                        </Badge>
                    </div>
                    <div className="product-cell">
                        <span>Pesho Peshkov</span>
                    </div>
                    <div className="product-cell price">
                        <NumberFormatter
                            value={100000}
                            suffix=" лв."
                            thousandSeparator
                        />
                    </div>

                    <div className="product-cell">
                        <Button
                            variant="gradient"
                            size="compact-sm"
                            gradient={{ from: "blue", to: "cyan", deg: 90 }}
                        >
                            Open Invoice
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
