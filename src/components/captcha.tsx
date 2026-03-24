import { Turnstile } from "@marsidev/react-turnstile";
import { CFG } from "@/utils/config";
import type { AnyElem } from "@/utils/element";

export default function Captcha(onSuccess: (token: string) => void): AnyElem {
	return (
		<Turnstile
			siteKey={CFG.cfTurnstileSiteKey}
			rerenderOnCallbackChange={false}
			onSuccess={onSuccess}
		/>
	);
}
