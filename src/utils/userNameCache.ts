import { useState, useEffect } from "react";
import { UserExt, UsersApi } from "delfruit-swagger-cg-sdk";

const CFG: Config = require("@/config.json");
const USERS_API_CLIENT = new UsersApi(undefined, CFG.apiURL.toString());

const userCache: Record<number, string> = {};

export function useUserNames(messages: { user_from_id?: number; user_to_id?: number }[], activeTab: "inbox" | "outbox") {
  const [names, setNames] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!messages?.length) return;

    const fetchUsers = async () => {
      const ids = new Set<number>();
      messages.forEach((msg) => {
        if (activeTab === "inbox" && msg.user_from_id) {
          ids.add(msg.user_from_id);
        }
        if (activeTab === "outbox" && msg.user_to_id) {
          ids.add(msg.user_to_id);
        }
      });

      const missingIds = [...ids].filter((id) => !userCache[id]);
      if (missingIds.length === 0) {
        setNames({ ...userCache });
        return;
      }

      await Promise.all(
        missingIds.map(async (id) => {
          try {
            const res = await USERS_API_CLIENT.getUser(id);
            const user: UserExt = (res as any).data ?? res;
            userCache[id] = user.name;
          } catch (err) {
            userCache[id] = "Unknown";
          }
        })
      );

      setNames({ ...userCache });
    };

    fetchUsers();
  }, [messages, activeTab]);

  return names;
}