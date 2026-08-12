import {
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import {
  NotificationsNone as NotificationsNoneIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningAmberIcon,
  ErrorOutlined as ErrorOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const NotificationDrawer = ({
  open,
  onClose,
  notifications = [],
  markAsRead = () => {},
  loadNotifications = () => {},
}) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon color="success" />;
      case "warning":
        return <WarningAmberIcon color="warning" />;
      case "error":
        return <ErrorOutlinedIcon color="error" />;
      default:
        return <InfoOutlinedIcon color="info" />;
    }
  };

  const handleNotificationClick = async (id) => {
    if (typeof markAsRead === "function") {
      await markAsRead(id);
    }
    if (typeof loadNotifications === "function") {
      await loadNotifications();
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Stack sx={{ width: 360, p: 3 }}>
        <Typography variant="h6" mb={2}>
          Notifications
        </Typography>

        <List>
          {notifications.length === 0 ? (
            <Box py={6} textAlign="center">
              <NotificationsNoneIcon
                sx={{ fontSize: 60, color: "text.secondary" }}
              />
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            notifications.map((n) => (
              <ListItem
                key={n._id}
                alignItems="flex-start"
                /* --- STEP 9: Mark as Read onClick --- */
                onClick={() => handleNotificationClick(n._id)}
                /* --- STEP 8: Notification Card Styling --- */
                sx={{
                  mb: 1,
                  borderRadius: 3,
                  bgcolor: n.read ? "background.paper" : "action.hover",
                  cursor: "pointer",
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateX(4px)",
                  },
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  {getIcon(n.type)}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {n.title}
                      </Typography>
                      {!n.read && (
                        <Chip label="New" color="error" size="small" />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Box component="span" display="block">
                      <Typography
                        variant="body2"
                        color="text.primary"
                        component="span"
                        display="block"
                      >
                        {n.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mt={0.5}
                      >
                        {dayjs(n.createdAt).fromNow()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Stack>
    </Drawer>
  );
};

export default NotificationDrawer;
