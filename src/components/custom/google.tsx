import Image from "next/image";

export const GoogleLoginButton = ({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex items-center justify-center w-full rounded-full border border-input bg-background text-foreground py-3 font-semibold text-base gap-3  transition hover:bg-muted disabled:opacity-60"
  >
    <Image
      src="/svgs/auth/google.svg"
      alt="Google"
      width={24}
      height={24}
      className="inline-block"
    />
    <span>Sign in with Google</span>
  </button>
);
