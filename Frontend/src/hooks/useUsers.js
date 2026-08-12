import { useCallback, useEffect, useState } from "react";

import {
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/userService";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const changeRole = async (userId, role) => {
    const data = await updateUserRole(userId, role);

    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? data.user
          : user
      )
    );
  };

  const changeStatus = async (userId, isActive) => {
    const data = await updateUserStatus(
      userId,
      isActive
    );

    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? data.user
          : user
      )
    );
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    loadUsers,
    changeRole,
    changeStatus,
  };
};

export default useUsers;