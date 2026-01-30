import { AnyElem } from "@/utils/element";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Reviews(): AnyElem {
	const router = useRouter();

	useEffect(() => {
		router.replace("/reviews/0");
	}, [router]);

	return null;
}