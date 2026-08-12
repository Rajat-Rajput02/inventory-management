import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
import { formatDate } from "../../utils/date";

const RecentProducts = ({ products }) => {
  const recent = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" mb={2}>
        Recently Added
      </Typography>

      <List>
        {recent.map((product) => (
          <ListItem key={product._id}>
            <ListItemText
              primary={product.name}
              secondary={formatDate(product.createdAt)}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentProducts;
