import {
  Alert,
  Box,
  Chip,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import PageHeader from "../components/layout/PageHeader";
import useUsers from "../hooks/useUsers";
import PageContainer from "../components/layout/PageContainer";

const Users = () => {
  const {
    users,
    loading,
    error,
    changeRole,
    changeStatus,
  } = useUsers();

  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        subtitle="Manage users, roles and account access"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>

              <TableCell>
                <strong>Email</strong>
              </TableCell>

              <TableCell>
                <strong>Role</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell>
                <strong>Account</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[1, 2, 3, 4, 5].map(
                      (item) => (
                        <TableCell key={item}>
                          <Skeleton />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              : users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {user.name || "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={user.role || "user"}
                          onChange={(e) =>
                            changeRole(
                              user._id,
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="admin">
                            Admin
                          </MenuItem>

                          <MenuItem value="manager">
                            Manager
                          </MenuItem>

                          <MenuItem value="user">
                            User
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          user.isActive
                            ? "Active"
                            : "Inactive"
                        }
                        color={
                          user.isActive
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        alignItems="center"
                      >
                        <Switch
                          checked={Boolean(
                            user.isActive
                          )}
                          onChange={(e) =>
                            changeStatus(
                              user._id,
                              e.target.checked
                            )
                          }
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 6 }}
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default Users;