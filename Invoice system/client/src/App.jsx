import HomePage from "./components/homePage"
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

function App() {

  return (
    <MantineProvider>
      <HomePage />
    </MantineProvider>
  )
}

export default App
