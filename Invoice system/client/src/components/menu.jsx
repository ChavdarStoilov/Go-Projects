export default function Menu() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="app-icon">
                   <h2 className="brand-name">Brand Name</h2>
                </div>
            </div>
            <ul className="sidebar-list">
                <li className="sidebar-list-item">
                    <a href="#">
                        <span>Home</span>
                    </a>
                </li>
                <li className="sidebar-list-item active">
                    <a href="#">
                        <span>Invoices</span>
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="#">
                        <span>Clients</span>
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="#">
                        <span>Inbox</span>
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="#">
                        <span>Notifications</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}
