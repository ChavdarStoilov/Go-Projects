import * as api from "../../api/data";
import { useEffect, useState } from "react";

export default function InvoiceTemplate({ invoiceData }) {
    const [items, setItems] = useState()


    useEffect (() => {
        api.GetInvoiceData(invoiceData.invoice_id)
        .then((result) => {
            if (result.status === 200){
                setItems(result.data)
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }, [])

    return <></>;
}
