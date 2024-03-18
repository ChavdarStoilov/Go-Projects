import Home from "./components/main/home";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';


function App() {
    return (
        <MantineProvider>
            <Home />
        </MantineProvider>
    );
}

export default App;
