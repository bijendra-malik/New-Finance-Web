import { useCallback, useEffect, useRef, useState } from "react";
import {
  markAllFranchiseNotificationsRead,
  markFranchiseNotificationsRead,
} from "../../../api/franchiseNotifications";

interface NotificationActionHandlers {
  onMarkRead: (id: string) => void;
  onMarkAllRead: (month?: string) => void;
}

interface NotificationActions {
  pendingIds: string[];
  markingAll: boolean;
  error: string | null;
  markRead: (id: string) => Promise<void>;
  markSelectedRead: (keys: string[], month?: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationActions = ({
  onMarkRead,
  onMarkAllRead,
}: NotificationActionHandlers): NotificationActions => {
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);
  const pending = useRef<Set<string>>(new Set());
  const marking = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const markRead = useCallback(
    async (id: string) => {
      if (!id || pending.current.has(id)) return;
      pending.current.add(id);
      setPendingIds(Array.from(pending.current));
      const res = await markFranchiseNotificationsRead([id]);
      pending.current.delete(id);
      if (!mounted.current) return;
      setPendingIds(Array.from(pending.current));
      if (res.ok) {
        setError(null);
        onMarkRead(id);
      } else {
        setError(res.message);
      }
    },
    [onMarkRead],
  );

  const runBulk = useCallback(
    async (request: () => Promise<{ ok: true } | { ok: false; message: string }>, month?: string) => {
      if (marking.current) return;
      marking.current = true;
      setMarkingAll(true);
      const res = await request();
      marking.current = false;
      if (!mounted.current) return;
      setMarkingAll(false);
      if (res.ok) {
        setError(null);
        onMarkAllRead(month);
      } else {
        setError(res.message);
      }
    },
    [onMarkAllRead],
  );

  const markSelectedRead = useCallback(
    (keys: string[], month?: string) => runBulk(() => markFranchiseNotificationsRead(keys), month),
    [runBulk],
  );

  const markAllRead = useCallback(
    () => runBulk(() => markAllFranchiseNotificationsRead()),
    [runBulk],
  );

  return { pendingIds, markingAll, error, markRead, markSelectedRead, markAllRead };
};
