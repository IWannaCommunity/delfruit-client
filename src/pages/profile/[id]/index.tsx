
import { useRouter } from "next/router";
import ProfilePage from "@/components/profile/profilePage";
import type { AnyElem } from "@/utils/element";

export default function ProfileById(): AnyElem {
	const router = useRouter();

	if (!router.isReady) {
		return <span>Loading...</span>;
	}

	const rawId = router.query.id;
	const id = typeof rawId === "string" ? Number(rawId) : NaN;

	if (!Number.isSafeInteger(id) || id <= 0) {
		return <ProfilePage profileId={-1} />;
	}

	return <ProfilePage profileId={id} />;
}
