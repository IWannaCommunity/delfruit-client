import { useState, useEffect, useMemo } from "react";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { API } from "@/utils/api";

const userCache: Record<number, string> = {};

export function useUserNames(
  messagesOrIds: { user_from_id?: number; user_to_id?: number }[] | number[],
  activeTab?: "inbox" | "outbox"
) {
  const [names, setNames] = useState<Record<number, string>>({});
	
  const ids = useMemo(() => {
		if (!messagesOrIds) return [];

		if (Array.isArray(messagesOrIds)) {
			if (typeof messagesOrIds[0] === "number") {
				return messagesOrIds as number[];
			}

			const messages = messagesOrIds as { user_from_id?: number; user_to_id?: number }[];

			return messages
				.map((msg) => {
					if (activeTab === "inbox") return msg.user_from_id;
					if (activeTab === "outbox") return msg.user_to_id;
					return undefined;
				})
				.filter((id): id is number => id !== undefined);
		}

		return [];
	}, [messagesOrIds, activeTab]);

  useEffect(() => {
    if (!ids.length) return;

    const uniqueIds = [...new Set(ids)];
    const missingIds = uniqueIds.filter((id) => !userCache[id]);

    if (!missingIds.length) {
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
  }, [ids]);

  return names;
}