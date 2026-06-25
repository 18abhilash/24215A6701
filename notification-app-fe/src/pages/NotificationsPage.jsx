import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";

const tabs = [
  { value: "all", label: "All Notifications" },
  { value: "priority", label: "Priority Inbox" },
];

const priorityWeight = {
  Placement: 30,
  Result: 20,
  Event: 10,
};

const PRIORITY_LIMIT = 10;

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("all");

  const { notifications, totalPages, loading, error } = useNotifications({
    filter,
    page,
  });

  const unreadCount = notifications.length;

  const priorityNotifications = useMemo(() => {
    return [...notifications]
      .map((notification) => {
        const timestamp = new Date(notification.Timestamp || notification.timestamp).getTime();
        const weight = priorityWeight[notification.Type] ?? priorityWeight[notification.type] ?? 0;
        return {
          ...notification,
          priorityScore: weight * 100000 + Number.isFinite(timestamp ? timestamp : 0),
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, PRIORITY_LIMIT);
  }, [notifications]);

  const displayedNotifications = view === "priority" ? priorityNotifications : notifications;

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter ?? "All");
    setPage(1);
  };

  const handlePageChange = (_, nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewChange = (_, nextValue) => {
    if (nextValue) {
      setView(nextValue);
    }
  };

  return (
    <Box sx={{ maxWidth: 840, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
      </Stack>

      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Notification workflow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the filter to limit the notification type and switch between the full feed and the top priority inbox.
          </Typography>
        </CardContent>
      </Card>

      <Tabs value={view} onChange={handleViewChange} sx={{ mb: 2 }}>
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center", mb: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
        <Chip label={`Showing ${view === "priority" ? PRIORITY_LIMIT : notifications.length} notifications`} size="small" />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && displayedNotifications.length === 0 && (
        <Alert severity="info">No notifications match your current filter.</Alert>
      )}

      {!loading && !error && displayedNotifications.length > 0 && (
        <Stack spacing={2}>
          {displayedNotifications.map((notification) => (
            <NotificationCard key={notification.ID ?? notification.id ?? notification.message} notification={notification} />
          ))}
        </Stack>
      )}

      {!loading && view === "all" && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
