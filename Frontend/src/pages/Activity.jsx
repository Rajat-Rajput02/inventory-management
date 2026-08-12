import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { getActivities } from "../services/activityService";

dayjs.extend(relativeTime);

const Activity = () => {
  const [activities, setActivities] = useState([]);

  const loadActivities = async () => {
    const data = await getActivities();
    const uniqueActivities = Array.from(
      new Map(
        (Array.isArray(data) ? data : []).map((item) => [item._id, item]),
      ).values(),
    );
    setActivities(uniqueActivities);
  };
  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Activity Log
      </Typography>

      {activities.map((activity) => (
        <Card key={activity._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography fontWeight={700}>{activity.action}</Typography>

            <Typography>{activity.description}</Typography>

            <Typography color="text.secondary" variant="body2">
              {dayjs(activity.createdAt).fromNow()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Activity;
