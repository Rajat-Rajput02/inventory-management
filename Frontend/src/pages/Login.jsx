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

import { loginSchema } from "../utils/authValidation";
import { loginUser } from "../services/AuthService";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const response = await loginUser(data);

      login(response);

      navigate("/");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {serverError && (
            <Alert severity="error">
              {serverError}
            </Alert>
          )}

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

          <AuthButton
            loading={isSubmitting}
            type="submit"
          >
            Login
          </AuthButton>

          <Typography align="center">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default Login;