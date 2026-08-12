import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

import { useState } from "react";

import CompanySettings from "../components/settings/CompanySettings";
import PreferenceSettings from "../components/settings/PreferenceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import PageContainer from "../components/layout/PageContainer";

const Settings = () => {

  const [tab, setTab] = useState(0);

  return (
    <PageContainer maxWidth="lg" sx={{ py: 4 }}>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Settings
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, value) => setTab(value)}
      >
        <Tab label="Company" />
        <Tab label="Preferences" />
        <Tab label="Notifications" />
        <Tab label="Security" />
      </Tabs>

      <Box mt={4}>
        {tab === 0 && <CompanySettings />}
        {tab === 1 && <PreferenceSettings />}
        {tab === 2 && <NotificationSettings />}
        {tab === 3 && <SecuritySettings />}
      </Box>
  </PageContainer>
  );
};

export default Settings;