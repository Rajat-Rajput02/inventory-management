import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { formatDate } from '../../utils/date';

const ActivityTimeline = ({
  activities,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        mb={2}
      >
        Recent Activity
      </Typography>

      <List>
        {activities.map((item) => (
          <ListItem
            key={item._id || item.id}
          >
            <ListItemText
              primary={item.description}
              secondary={
                formatDate(item.createdAt)
            }
            />
            
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ActivityTimeline;