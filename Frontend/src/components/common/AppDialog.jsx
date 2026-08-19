import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const AppDialog = ({ open, title, children, actions, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" disableRestoreFocus>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default AppDialog;
