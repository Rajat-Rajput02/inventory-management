import {
  Box,
  Button,
  Card,
  Grid,
  CardContent,
  Chip,
  Stack,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import AppSnackbar from "../components/common/AppSnackbar";
import PageContainer from "../components/layout/PageContainer";

import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} from "../services/userService";

import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import AvatarUploader from "../components/profile/AvatarUploader";

import useAuth from "../hooks/useAuth";
import { formatDate } from "../utils/date";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    company: "",
    bio: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };
  //========================
  // Load Profile
  //========================

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      setProfile(data);

      setEditData({
        name: data.name,
        phone: data.phone,
        company: data.company,
        bio: data.bio,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProfile();
  }, []);
  //========================
  //  Avatar Uploader
  //========================
const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const upload = await uploadAvatar(formData);

    updateUser({
      ...user,
      avatar: upload.avatar,
    });

    setProfile((prev) => ({
      ...prev,
      avatar: upload.avatar,
    }));

    showSnackbar("Avatar updated successfully");
  } catch (err) {
    console.error("Avatar upload failed:", err);

    showSnackbar(
      err.response?.data?.message || "Failed to upload avatar",
      "error",
    );
  }
 // Allows selecting the same file again
  e.target.value = "";
};
  //====  Handle Profile Update  ==================
  const handleProfileUpdate = async () => {
    try {
      const data = await updateProfile(editData);
      setProfile(data.user);
      updateUser(data.user);
      setEditing(false);
      showSnackbar("Profile updated successfully");
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };
  // ==========  Password Change   ======================
  const handlePasswordChange = async () => {
    try {
      await changePassword(passwords);

      showSnackbar("Password changed successfully");

      setPasswords({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Unable to change password",
        "error",
      );
    }
  };

  return (
    <PageContainer>
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5 }}>
      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 1,
        }}
      >
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <AvatarUploader
              user={user}
              onUpload={handleAvatarUpload}
              sx={{
                width: 110,
                height: 110,
                fontSize: 42,
              }}
            >
              {!user?.avatar && initials}
            </AvatarUploader>

            <Typography variant="h4" fontWeight={700}>
              {profile?.name}
            </Typography>

            <Typography color="text.secondary">{profile?.email}</Typography>

            <Chip
              label={profile?.role}
              color={profile?.role === "admin" ? "error" : "primary"}
            />

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={700} mb={2}>
              Personal Information
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Full Name"
                value={editData.name}
                disabled={!editing}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
              />

              <TextField
                label="Phone"
                value={editData.phone}
                disabled={!editing}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    phone: e.target.value,
                  })
                }
              />

              <TextField
                label="Company"
                value={editData.company}
                disabled={!editing}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    company: e.target.value,
                  })
                }
              />

              <TextField
                label="Bio"
                multiline
                rows={4}
                value={editData.bio}
                disabled={!editing}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    bio: e.target.value,
                  })
                }
              />
              {editing && (
                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleProfileUpdate}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditing(false);

                      setEditData({
                        name: profile.name,
                        phone: profile.phone,
                        company: profile.company,
                        bio: profile.bio,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
          {/*  Password Change Section  */}
          <Divider sx={{ my: 5 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Change Password
          </Typography>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  currentPassword: e.target.value,
                })
              }
            />
            <TextField
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  newPassword: e.target.value,
                })
              }
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handlePasswordChange}
            >
              Change Password
            </Button>
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight={700}>Member Since</Typography>

              <Typography>{formatDate(profile?.createdAt)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight={700}>User ID</Typography>

              <Typography>{profile?._id}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <AppSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={closeSnackbar}
      />
    </Box>
    </PageContainer>
  );
};

export default Profile;
