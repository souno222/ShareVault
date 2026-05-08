import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   Clerk appearance tokens — strip every rounded corner, shadow,
   and color outside the WIRED grayscale + #057dbc palette.
   ───────────────────────────────────────────────────────────── */
const clerkAppearance = {
  variables: {
    colorPrimary: "#000000",
    colorText: "#1a1a1a",
    colorTextSecondary: "#757575",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#1a1a1a",
    colorDanger: "#e53e3e",
    borderRadius: "0px",
    fontFamily: "'Inter', helvetica, sans-serif",
    fontSize: "14px",
  },
  elements: {
    /* Root card — match our 2px ink border container */
    card: "shadow-none rounded-none border-0 bg-paper",
    /* Clerk's internal header — hide it; we draw our own above */
    header: "hidden",
    /* Body / form area */
    main: "p-0",
    /* Social OAuth buttons */
    socialButtonsBlockButton:
      "rounded-none border-2 border-ink text-ink bg-paper font-ui font-bold text-sm tracking-btn hover:bg-ink hover:text-paper transition-colors duration-150 shadow-none",
    socialButtonsBlockButtonText: "font-ui font-bold text-sm",
    /* Divider line */
    dividerLine: "bg-ink",
    dividerText: "font-mono text-[0.75rem] tracking-kicker uppercase text-caption",
    /* Inputs */
    formFieldInput:
      "rounded-none border-2 border-ink bg-paper text-page-ink font-ui text-sm focus:outline-none focus:ring-0 focus:border-ink shadow-none placeholder:text-disabled",
    formFieldLabel: "font-mono text-[0.75rem] tracking-kicker uppercase text-page-ink",
    formFieldErrorText: "font-ui text-xs text-[#e53e3e]",
    /* Primary submit button */
    formButtonPrimary:
      "rounded-none border-2 border-ink bg-ink text-paper font-ui font-bold text-sm tracking-btn hover:bg-paper hover:text-ink transition-colors duration-150 shadow-none",
    /* Footer (links below form) */
    footer: "border-t border-hairline mt-0 pt-4",
    footerActionText: "font-ui text-sm text-caption",
    footerActionLink: "font-ui text-sm text-link-blue underline hover:text-ink transition-colors duration-[120ms]",
    /* Internal nav links (forgot password, etc.) */
    formFieldAction: "font-ui text-sm text-link-blue underline hover:text-ink transition-colors duration-[120ms]",
    /* Identity preview (email shown after step 1) */
    identityPreviewText: "font-ui text-sm text-page-ink",
    identityPreviewEditButton: "font-ui text-sm text-link-blue underline",
    /* OTP / verification fields */
    otpCodeFieldInput: "rounded-none border-2 border-ink text-page-ink font-mono text-base shadow-none",
    /* Alert / error banner */
    alert: "rounded-none border-l-4 border-[#e53e3e] bg-paper",
    alertText: "font-ui text-sm text-page-ink",
  },
};

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper flex flex-col">

      {/* ── Minimal top bar ── */}
      <div className="border-b-2 border-ink bg-paper">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16 h-14 flex items-center justify-between">
          <a
            href="/"
            className="font-display font-bold text-[1.4rem] tracking-hero text-ink no-underline leading-none"
          >
            ShareVault
          </a>
          <button
            onClick={() => navigate("/sign-up")}
            className="font-ui text-sm text-page-ink underline hover:text-link-blue transition-colors duration-[120ms] bg-transparent border-none cursor-pointer"
          >
            No account? Sign up
          </button>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">

        {/* Editorial header above the card */}
        <div className="w-full max-w-[480px] mb-8">
          {/* Mono kicker */}
          <p className="font-mono text-[0.75rem] tracking-kicker uppercase text-caption leading-kicker mb-3">
            Secure Access
          </p>
          {/* Display headline */}
          <h1 className="font-display font-bold text-[2.5rem] leading-hero tracking-hero text-page-ink mb-2">
            Sign In
          </h1>
          {/* Hairline rule */}
          <hr className="border-0 border-t-2 border-ink" />
        </div>

        {/* ── Clerk card wrapper ── */}
        <div className="w-full max-w-[480px] border-2 border-ink bg-paper p-8">
          <SignIn
            appearance={clerkAppearance}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

        {/* Bottom editorial note */}
        <div className="w-full max-w-[480px] mt-6 border-t border-hairline pt-4">
          <p className="font-mono text-[0.75rem] tracking-kicker uppercase text-caption">
            ShareVault &mdash; Secure file sharing platform
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignInPage;
