import { SignUp } from "@clerk/clerk-react";
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
    /* Root card — flatten Clerk's own card treatment */
    card: "shadow-none rounded-none border-0 bg-paper",
    /* Clerk's internal header — hidden; we draw our own above */
    header: "hidden",
    /* Body / form area */
    main: "p-0",
    /* Social OAuth buttons */
    socialButtonsBlockButton:
      "rounded-none border-2 border-ink text-ink bg-paper font-ui font-bold text-sm tracking-btn hover:bg-ink hover:text-paper transition-colors duration-150 shadow-none",
    socialButtonsBlockButtonText: "font-ui font-bold text-sm",
    /* Divider */
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
    /* Footer links */
    footer: "border-t border-hairline mt-0 pt-4",
    footerActionText: "font-ui text-sm text-caption",
    footerActionLink: "font-ui text-sm text-link-blue underline hover:text-ink transition-colors duration-[120ms]",
    /* Inline action links */
    formFieldAction: "font-ui text-sm text-link-blue underline hover:text-ink transition-colors duration-[120ms]",
    /* Identity preview */
    identityPreviewText: "font-ui text-sm text-page-ink",
    identityPreviewEditButton: "font-ui text-sm text-link-blue underline",
    /* OTP verification inputs */
    otpCodeFieldInput: "rounded-none border-2 border-ink text-page-ink font-mono text-base shadow-none",
    /* Alert banner */
    alert: "rounded-none border-l-4 border-[#e53e3e] bg-paper",
    alertText: "font-ui text-sm text-page-ink",
  },
};

const SignUpPage = () => {
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
            onClick={() => navigate("/sign-in")}
            className="font-ui text-sm text-page-ink underline hover:text-link-blue transition-colors duration-[120ms] bg-transparent border-none cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">

        {/* Editorial header above the card */}
        <div className="w-full max-w-[480px] mb-8">
          {/* Mono kicker */}
          <p className="font-mono text-[0.75rem] tracking-kicker uppercase text-caption leading-kicker mb-3">
            Create Your Account
          </p>
          {/* Display headline */}
          <h1 className="font-display font-bold text-[2.5rem] leading-hero tracking-hero text-page-ink mb-2">
            Get Started
          </h1>
          {/* Deck */}
          <p className="font-body text-[1rem] leading-deck text-caption mb-3">
            Join thousands of teams sharing files securely.
          </p>
          {/* 2px hairline rule */}
          <hr className="border-0 border-t-2 border-ink" />
        </div>

        {/* ── Clerk card wrapper ── */}
        <div className="w-full max-w-[480px] border-2 border-ink bg-paper p-8">
          <SignUp
            appearance={clerkAppearance}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
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

export default SignUpPage;
