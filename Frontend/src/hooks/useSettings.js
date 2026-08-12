import { useEffect, useState } from "react";
import {
  getSettings,
  updateSettings,
} from "../services/settingsService";

const useSettings = () => {
  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await getSettings();

      setSettings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async (payload) => {
    const updated = await updateSettings(payload);

    setSettings(updated);

    return updated;
  };

  return {
    settings,
    loading,
    saveSettings,
    reload: loadSettings,
  };
};

export default useSettings;