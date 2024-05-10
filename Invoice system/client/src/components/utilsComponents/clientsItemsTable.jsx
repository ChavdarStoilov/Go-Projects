import { Badge, Button, NumberFormatter } from "@mantine/core";

export default function ClientsItemsTable({ clients }) {

    return (
        <>
            {clients.length > 0 &&
                clients.map((item, key) => (
                    <div className="products-row" key={key}>
                        <div className="product-cell">
                            <span>{item.id}</span>
                        </div>
                        <div className="product-cell">
                            <span>{item.first_name}</span>
                        </div>
                        <div className="product-cell">
                            <span>{item.last_name}</span>
                        </div>
                        <div className="product-cell">
                            <span>{item.phone}</span>
                        </div>

                        <div className="product-cell">
                            <Button
                                variant="gradient"
                                size="compact-sm"
                                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                            >
                                Open client
                            </Button>
                        </div>
                    </div>
                ))}
        </>
    );
}
