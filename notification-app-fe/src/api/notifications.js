import { fetchWithLogging } from "./logging";

const BASE_URL = "http://4.224.186.213/evaluation-service/notifications";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyNDIxNWE2NzA4QGJ2cml0LmFjLmluIiwiZXhwIjoxNzgyMzgwMzQ4LCJpYXQiOjE3ODIzNzk0NDgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI1OTEzY2Q0My01YmVlLTRhYTQtOTBkNC03MzA0YTJjMmIwNWEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzYWthIG1hbmlzaCIsInN1YiI6IjdkOGE0MGVjLWJjZGYtNDAzNi04MTUxLTRmYjE1OTNmM2ExNiJ9LCJlbWFpbCI6IjI0MjE1YTY3MDhAYnZyaXQuYWMuaW4iLCJuYW1lIjoic2FrYSBtYW5pc2giLCJyb2xsTm8iOiIyNDIxNWE2NzA4IiwiYWNjZXNzQ29kZSI6ImFoWGp2cCIsImNsaWVudElEIjoiN2Q4YTQwZWMtYmNkZi00MDM2LTgxNTEtNGZiMTU5M2YzYTE2IiwiY2xpZW50U2VjcmV0IjoiQWVuaFZuZnZESnNydkdiRyJ9.jnYzpMWylC2hVs7DdIPabK9jvkgUn1vAxuF40qAy6oQ";

export async function fetchNotifications({ page = 1, limit = 10, notificationType } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (notificationType && notificationType !== "All") {
    params.set("notification_type", notificationType);
  }

  const response = await fetchWithLogging(`${BASE_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  const data = await response.json();

  return {
    notifications: Array.isArray(data.notifications) ? data.notifications : [],
    total: typeof data.total === "number" ? data.total : undefined,
    totalPages: typeof data.totalPages === "number" ? data.totalPages : undefined,
  };
}
