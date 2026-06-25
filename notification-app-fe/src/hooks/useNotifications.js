import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";

const PAGE_SIZE = 10;

export function useNotifications({ filter, page }) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const load = async () => {
      try {
        const data = await fetchNotifications({
          page,
          limit: PAGE_SIZE,
          notificationType: filter,
        });

        if (!active) return;

        setNotifications(data.notifications ?? []);
        const count = typeof data.total === "number" ? data.total : data.notifications.length;
        setTotal(count);

        if (typeof data.totalPages === "number") {
          setTotalPages(data.totalPages);
        } else if (typeof data.total === "number") {
          setTotalPages(Math.max(1, Math.ceil(data.total / PAGE_SIZE)));
        } else {
          setTotalPages(data.notifications.length >= PAGE_SIZE ? page + 1 : page);
        }
      } catch (err) {
        if (!active) return;
        setNotifications([]);
        setTotal(0);
        setTotalPages(1);
        setError(err?.message ?? "Unable to load notifications.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [filter, page]);

  return { notifications, total, totalPages, loading, error };
}
