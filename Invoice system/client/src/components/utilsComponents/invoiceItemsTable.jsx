import { Badge, Button, NumberFormatter } from "@mantine/core";

export default function InvoiceItemsTable({ invoice }) {
    const Statuses = {
        "active": "yellow",
        "completed": "green",
        "rejected": "red",
    };


    return (
        <>
            {invoice &&
                invoice.map((item, key) => (
                    <div className="products-row" key={key}>
                        <div className="product-cell">
                            <span>{item.id}</span>
                        </div>
                        <div className="product-cell status-cell">
                            <Badge variant="dot" color={Statuses[item.status]} size="md">
                                {item.status}
                            </Badge>
                        </div>
                        <div className="product-cell">
                            <span>{item.first_name} {item.last_name}</span>
                        </div>
                        <div className="product-cell price">
                            <NumberFormatter
                                value={item.amount}
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
                ))}
        </>
    );
}
