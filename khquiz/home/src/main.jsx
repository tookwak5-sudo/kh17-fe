import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// react bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/flatly/bootstrap.min.css";

import App from "./App.jsx";
import './index.css'

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);