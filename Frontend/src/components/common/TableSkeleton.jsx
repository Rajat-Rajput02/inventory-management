import { Box, Skeleton } from "@mui/material";

const TableSkeleton = () => {
  return (
    <Box p={2}>
      {[...Array(8)].map((_, index) => (
        <Skeleton
          key={index}
          height={60}
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );
};

export default TableSkeleton;