import { CssBaseline, Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import './App.css';
import AboutPage from './p/About';
import NavigateComponent from './p/c/Navigate';
import DHCPPage from './p/DHCP';
import IndexPage from './p/Index';
import ProtectionPage from './p/Protection';
import PinPage from './p/Pin';
import SIMPage from './p/SIM';
import WiFiPage from './p/WiFi';
import SimInfoPage from './p/SimInfo';
import NetworkInfoPage from './p/NetworkInfo';
import DevicePage from './p/DeviceInfo';
import OperationPage from './p/Operation';
import PasswordPage from './p/Password';
import ClientsPage from "./p/Clients";

const App = () => {

  return <div className="App">

    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <div style={{ flexGrow: 1, order: 1 }}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="wifi" element={<WiFiPage />} />
          <Route path="sim" element={<SIMPage />} />
          <Route path="dhcp" element={<DHCPPage />} />
          <Route path="protection" element={<ProtectionPage />} />
          <Route path="pin" element={<PinPage />} />
          <Route path="network_info" element={<NetworkInfoPage />} />
          <Route path="sim_info" element={<SimInfoPage />} />
          <Route path="device_info" element={<DevicePage />} />
          <Route path="operation" element={<OperationPage />} />
          <Route path="password" element={<PasswordPage />} />
        </Routes>
      </div>
      <NavigateComponent />
    </Box>

  </div>
}
export default App
