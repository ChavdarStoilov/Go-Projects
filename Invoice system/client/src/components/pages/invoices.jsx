import { Badge, Button, NumberFormatter  } from "@mantine/core";

export default function Invoices({ data }) {
    return (
        <div className="products-area-wrapper tableView">
            <div className="products-header">
                <div className="product-cell">ID</div>
                <div className="product-cell status-cell">Status</div>
                <div className="product-cell price">Amount</div>
                <div className="product-cell price"></div>
            </div>

            <div className="products-row">
                <div className="product-cell">
                    <span>0000001</span>
                </div>
                <div className="product-cell status-cell">
                    <span className="cell-label">Status:</span>
                    <Badge variant="dot" color="green" size="md">
                        Active
                    </Badge>
                </div>

                <div className="product-cell price">
                    <span className="cell-label">Price:</span><NumberFormatter value={100000} suffix=" лв." thousandSeparator />
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
    );
}
