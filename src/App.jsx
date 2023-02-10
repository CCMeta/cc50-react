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
import LoginPage from "./p/Login";
import SMSPage from "./p/SMS";


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    Aqua_Blue: {
      light: '#29b6f6',
      main: '#198fcf',
      dark: '#0c6ca8',
      contrastText: '#DDD',
    },
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
            <Route path="sms" element={<SMSPage />} />
            <Route path="settings" element={<SettingsPage store={store} />} />
          </Routes>
        </Box>
        <NavigateComponent store={store} />
        <LoginPage />
      </Box>
    </ThemeProvider>
  </div>
}
export default App
