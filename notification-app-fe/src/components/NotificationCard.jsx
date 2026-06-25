import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";

const typeColors = {
  Placement: "success",
  Result: "primary",
  Event: "warning",
};

export function NotificationCard({ notification }) {
  const type = notification.Type ?? notification.type ?? "Unknown";
  const message = notification.Message ?? notification.message ?? "No message";
  const timestamp = notification.Timestamp ?? notification.timestamp;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {type} notification
            </Typography>
          </Stack>
          <Chip label={type} color={typeColors[type] ?? "default"} size="small" />
        </Stack>
        {timestamp && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            {new Date(timestamp).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
