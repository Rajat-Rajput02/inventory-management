import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Typography,
} from "@mui/material";
import { formatDate } from '../../utils/date';

const ProductTransactionList = ({ transactions = [] }) => {
  if (!transactions.length) {
    return (
      <Typography color="text.secondary">
        No Transactions Found
      </Typography>
    );
  }

  return (
    <List>
      {transactions.map((item) => (
        <ListItem key={item._id} divider>
          <ListItemText
            primary={`${item.type} • ${item.quantity}`}
            secondary={`${item.reason} • ${formatDate(transactions.createdAt)}`}
          />

          <Chip
            label={item.type}
            color={
              item.type === "IN"
                ? "success"
                : "warning"
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ProductTransactionList;