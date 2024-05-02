import { useState, useEffect } from "react"
import * as api from "../api/data.js"

export default function HomePage() {
    const [brandData, setBrandData ] = useState(false)

    useEffect(() => {
        api.GetBrandData()
        .then((result) => {
            if (result.status === 200 && result.data !== null) {
                console.log(result.data);
            };
        })
        .catch((error) => {
            console.log(error);
        });

    }, [brandData]);

    console.log(brandData);
    return (
        <>
        </>
    )
}