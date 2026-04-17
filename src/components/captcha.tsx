import { Turnstile } from "@marsidev/react-turnstile";
import { CFG } from "@/utils/config";
import type { AnyElem } from "@/utils/element";

type CaptchaProps = {
	onSuccess: (token: string) => void;
}

export default function Captcha({onSuccess}: CaptchaProps): AnyElem {
	return (
		<Turnstile
			siteKey={CFG.cfTurnstileSiteKey}
			rerenderOnCallbackChange={false}
			onSuccess={onSuccess}
		/>
	);
}