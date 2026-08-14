import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Badge,
} from "@mui/material";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

import useAuth from "../../hooks/useAuth";
import { Inventory2, DarkMode, LightMode } from "@mui/icons-material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import { useThemeContext } from "../../context/ThemeContext";

const Navbar = ({
  openNotifications = () => {},
  unreadCount = 0,
  onToggleSidebar = () => {},
}) => {
  const { mode, toggleTheme } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderRadius: 3,
        mb: 4,
        backgroundColor: "#1976d2", // Primary blue background
        pt: 3, // Extra space at the VERY top
        pb: 3, // Bottom padding inside header
        mt: 1,
        px: { xs: 2, sm: 3, md: 4 }, // Horizontal spacing
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        gap: 1.5,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "auto !important", // Prevents default MUI toolbar height compression
          gap: 1.5,
        }}
      >
        <IconButton color="inherit" onClick={onToggleSidebar} sx={{ mr: 1 }}>
          <Inventory2 />
        </IconButton>

        <Typography
          component={RouterLink}
          to={ROUTES.DASHBOARD}
          variant="h6"
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: 800, // Makes header text bolder
            fontSize: { xs: "1.25rem", sm: "1.6rem", md: "1.85rem" }, // Larger font size
            letterSpacing: "0.5px", // Clean modern text spacing
            textTransform: "capitalize",
          }}
        >
          Inventory Management
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Dark/Light Mode Toggle */}
        <IconButton color="inherit" onClick={toggleTheme}>
          {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* Notifications Icon with Badge */}
        <IconButton
          onClick={openNotifications}
          sx={{
            color: "white",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 2,
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Profile Menu Trigger */}
        <IconButton color="inherit" onClick={handleOpen}>
          <Avatar src={user?.avatar || ""} sx={{ width: 36, height: 36 }}>
            {!user?.avatar && initials}
          </Avatar>
        </IconButton>

        {/* Profile Dropdown Menu */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            component={RouterLink}
            to={ROUTES.PROFILE}
            onClick={handleClose}
          >
            <PersonIcon sx={{ mr: 1 }} />
            Profile
          </MenuItem>

          <MenuItem
            component={RouterLink}
            to={ROUTES.SETTINGS}
            onClick={handleClose}
          >
            <SettingsIcon sx={{ mr: 1 }} />
            Settings
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
