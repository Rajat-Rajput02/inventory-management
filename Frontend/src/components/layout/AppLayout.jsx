import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import AppSnackbar from "../common/AppSnackbar";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NotificationDrawer from "../dashboard/NotificationDrawer";
import {
  getNotifications,
  markAsRead,
} from "../../services/notificationService";

const drawerWidth = 260;

const AppLayout = () => {
  const theme = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showSnackbar = (message, severity = "error") =>
    setSnackbar({ open: true, message, severity });

  const handleOpenSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const loadNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Error loading notifications",
      );
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Sidebar
        drawerWidth={drawerWidth}
        open={mobileSidebarOpen}
        onClose={handleCloseSidebar}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <Navbar
          onToggleSidebar={handleOpenSidebar}
          openNotifications={() => setNotificationOpen(true)}
          unreadCount={
            notifications.filter((notification) => !notification.read).length
          }
        />

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>

      <NotificationDrawer
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        notifications={notifications}
        markAsRead={async (id) => {
          try {
            await markAsRead(id);
            await loadNotifications();
          } catch (error) {
            showSnackbar(
              error?.response?.data?.message ||
                "Failed to mark notification as read",
              "error",
            );
          }
        }}
        loadNotifications={loadNotifications}
      />
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default AppLayout;
