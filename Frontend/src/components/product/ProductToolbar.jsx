import {
  Paper,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const ProductToolbar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  onAddProduct,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mt: 4,
        mb: 3,
        borderRadius: 3,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        sx={{ justifyContent: "space-between" }}
      >
        {/* Search */}

        <TextField
          label="Search Product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: {
              xs: "100%",
              md: 350,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Category */}

        <TextField
          select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{
            width: {
              xs: "100%",
              md: 220,
            },
          }}
        >
          <MenuItem value="">All Categories</MenuItem>

          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Button */}

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onAddProduct}
        >
          Add Product
        </Button>
      </Stack>
    </Paper>
  );
};

export default ProductToolbar;
