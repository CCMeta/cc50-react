import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from "react-router-dom";

import { createStore } from "react-solid-state";
import './App.css';
import HeaderBar from "./p/c/HeaderBar";
import NavigateComponent from './p/c/Navigate';
import ClientsPage from "./p/Clients";
import IndexPage from './p/Index';
import SettingsPage from "./p/Settings";


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  const store = createStore({ tabValue: "wifi", language: "en" })

  return <div className="App">
    <ThemeProvider theme={darkTheme}>
      <HeaderBar />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1, order: 1, ml: { md: "4vw" } }}>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="settings" element={<SettingsPage store={store} />} />
          </Routes>
        </Box>
        <NavigateComponent store={store} />
      </Box>
    </ThemeProvider>
  </div>
}
export default App
