import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const DeleteDialog = ({ open, onClose, onDelete, product }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <WarningAmberIcon color="warning" />
        Delete Product
      </DialogTitle>

      <DialogContent>
        <Typography>
          You are about to permanently delete
          <strong>{product?.name}</strong>. This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>

        <Button color="error" variant="contained" onClick={onDelete}>
          Delete Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
