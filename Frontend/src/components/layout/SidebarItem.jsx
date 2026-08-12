import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon, text, to, onClick }) => {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        mb: 1,

        "&.active": {
          bgcolor: "primary.main",
          color: "white",

          "& .MuiListItemIcon-root": {
            color: "white",
          },
        },
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>

      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export default SidebarItem;
