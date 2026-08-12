import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  AddCircle,
  Edit,
  Delete,
} from "@mui/icons-material";
import { formatDate } from "../../utils/date";

const icons = {
  CREATE: <AddCircle color="success" />,
  UPDATE: <Edit color="primary" />,
  DELETE: <Delete color="error" />,
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        mb={2}
        fontWeight={700}
      >
        Recent Activity
      </Typography>

      <List>
        {activities.length === 0 ? (
          <Typography color="text.secondary">
            No recent activity
          </Typography>
        ) : (
          activities.map((activity, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {icons[activity.action] || <AddCircle color="action" />}
              </ListItemIcon>

              <ListItemText
                primary={activity.description || activity.action}
                secondary={formatDate(activity.createdAt)}
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default RecentActivity;