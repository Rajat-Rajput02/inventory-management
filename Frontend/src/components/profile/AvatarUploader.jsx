import { useRef } from "react";
import { Avatar, Badge, IconButton } from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const AvatarUploader = ({ user, onUpload }) => {
  const inputRef = useRef();

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <input
        hidden
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onUpload}
      />

      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        badgeContent={
          <IconButton
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "white",
            }}
            onClick={() => inputRef.current.click()}
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
        }
      >
        <Avatar
          src={user?.avatar || ""}
          sx={{
            width: 120,
            height: 120,
            fontSize: 40,
          }}
        >
          {!user?.avatar && initials}
        </Avatar>
      </Badge>
    </>
  );
};

export default AvatarUploader;
