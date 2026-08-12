import { Chip } from "@mui/material";
import { getStatusColor } from "../../constants/status";

const StatusChip = ({ status }) => (
  <Chip
    label={status}
    color={getStatusColor(status)}
    size="small"
  />
);

export default StatusChip;