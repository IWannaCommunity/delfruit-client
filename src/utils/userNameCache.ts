import { useState, useEffect } from "react";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { API } from "@/utils/api";

const userCache: Record<number, string> = {};

export function useUserNames(
  messagesOrIds: { user_from_id?: number; user_to_id?: number }[] | number[],
  activeTab?: "inbox" | "outbox"
) {
  const [names, setNames] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!messagesOrIds) return;

    let ids: number[] = [];

    if (Array.isArray(messagesOrIds)) {
      if (typeof messagesOrIds[0] === "number") {
        ids = messagesOrIds as number[];
      } else {
        const messages = messagesOrIds as { user_from_id?: number; user_to_id?: number }[];
        messages.forEach((msg) => {
          if (activeTab === "inbox" && msg.user_from_id) ids.push(msg.user_from_id);
          if (activeTab === "outbox" && msg.user_to_id) ids.push(msg.user_to_id);
        });
      }
    }

    const uniqueIds = [...new Set(ids)];
    if (!uniqueIds.length) return;

    const missingIds = uniqueIds.filter((id) => !userCache[id]);
    if (missingIds.length === 0) {
      setNames({ ...userCache });
      return;
    }

    const fetchUsers = async () => {
      await Promise.all(
        missingIds.map(async (id) => {
          try {
            const res = await API.users().getUser(id);
            const user: UserExt = (res as any).data ?? res;
            userCache[id] = user.name;
          } catch {
            userCache[id] = "Unknown";
          }
        })
      );
      setNames({ ...userCache });
    };

    fetchUsers();
  }, [JSON.stringify(messagesOrIds), activeTab]);

  return names;
}