import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Stack,
  Typography,
  Alert,
} from "@mui/material";

import AuthLayout from "../components/auth/AuthLayout";
import AuthTextField from "../components/auth/AuthTextField";
import PasswordField from "../components/auth/PasswordField";
import AuthButton from "../components/auth/AuthButton";

import { registerSchema } from "../utils/authValidation";
import { registerUser } from "../services/AuthService";

const Register = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");

      delete data.confirmPassword;

      await registerUser(data);

      navigate("/login");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {serverError && (
            <Alert severity="error">
              {serverError}
            </Alert>
          )}

          <AuthTextField
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <AuthTextField
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <PasswordField
            label="Password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <PasswordField
            label="Confirm Password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword?.message
            }
          />

          <AuthButton
            loading={isSubmitting}
            type="submit"
          >
            Register
          </AuthButton>

          <Typography align="center">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default Register;