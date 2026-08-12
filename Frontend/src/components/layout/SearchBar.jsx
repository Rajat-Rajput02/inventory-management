import {
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        width: 350,
        borderRadius: 3,
      }}
    >
      <InputBase
        placeholder="Search products..."
        sx={{ flex: 1 }}
      />

      <IconButton>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;