import {
  Drawer,
  Typography,
  Toolbar,
  List,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import SpaceDashboardTwoToneIcon from "@mui/icons-material/SpaceDashboardTwoTone";
import PeopleIcon from "@mui/icons-material/People";

import SidebarItem from "./SidebarItem";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
const Sidebar = ({ drawerWidth, open = false, onClose = () => {} }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Drawer
      variant={isDesktop ? "permanent" : "temporary"}
      open={isDesktop ? true : open}
      onClose={isDesktop ? undefined : onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", md: "block" },
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
        <Inventory2Icon fontSize="large" />
        <Typography variant="h5" fontWeight={700}>
          InventoryPro
        </Typography>
      </Box>

      <Toolbar />

      <List sx={{ p: 2 }}>
        <SidebarItem
          to="/"
          text="Dashboard"
          icon={<SpaceDashboardTwoToneIcon />}
          onClick={onClose}
        />

        <SidebarItem
          to={ROUTES.PRODUCTS}
          text="Products"
          icon={<Inventory2Icon />}
          onClick={onClose}
        />

        {/* Admin-only Users link */}
        {(user?.role === "admin" || user?.role === "manager") && (
          <SidebarItem
            to={ROUTES.USER}
            text="Users"
            icon={<PeopleIcon />}
            onClick={onClose}
          />
        )}

        <Typography variant="caption" sx={{ fontWeight: 700, px: 2 }}>
          MAIN
        </Typography>

        <SidebarItem
          to={ROUTES.TRANSACTIONS}
          text="Transactions"
          icon={<Inventory2Icon />}
          onClick={onClose}
        />

        <SidebarItem
          to={ROUTES.CATEGORIES}
          text="Categories"
          icon={<CategoryIcon />}
          onClick={onClose}
        />

        <SidebarItem
          to={ROUTES.WAREHOUSES}
          text="Warehouses"
          icon={<WarehouseIcon />}
          onClick={onClose}
        />

        <SidebarItem
          to={ROUTES.SUPPLIERS}
          text="Suppliers"
          icon={<LocalShippingIcon />}
          onClick={onClose}
        />

        <SidebarItem
          to={ROUTES.REPORTS}
          text="Reports"
          icon={<AssessmentIcon />}
          onClick={onClose}
        />

        <Typography variant="caption" sx={{ fontWeight: 700, px: 2 }}>
          INVENTORY
        </Typography>

        <SidebarItem
          to={ROUTES.PROFILE}
          text="Profile"
          icon={<PersonIcon />}
          onClick={onClose}
        />
        <SidebarItem
          to={ROUTES.ACTIVITY}
          text="Activity Log"
          icon={<HistoryIcon />}
          onClick={onClose}
        />
      </List>
    </Drawer>
  );
};

export default Sidebar;
