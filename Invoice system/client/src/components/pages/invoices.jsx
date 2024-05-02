import { Badge } from '@mantine/core';


export default function Invoices() {
    return (
        <div className="products-area-wrapper tableView">
            <div className="products-header">
                <div className="product-cell">ID</div>
                <div className="product-cell category">Items</div>
                <div className="product-cell status-cell">Status</div>
                <div className="product-cell sales">Quantity</div>
                <div className="product-cell stock">Price</div>
                <div className="product-cell price">Amount</div>
            </div>

            <div className="products-row">
                <div className="product-cell">
                    <span>Ocean</span>
                </div>
                <div className="product-cell category">
                    <span className="cell-label">Category:</span>Furniture
                </div>
                <div className="product-cell status-cell">
                    <span className="cell-label">Status:</span>
                    <Badge variant="dot" color="green" size="md">
                        Active
                    </Badge>
                </div>
                <div className="product-cell sales">
                    <span className="cell-label">Sales:</span>11
                </div>
                <div className="product-cell stock">
                    <span className="cell-label">Stock:</span>36
                </div>
                <div className="product-cell price">
                    <span className="cell-label">Price:</span>$560
                </div>
            </div>
        </div>
    );
}
