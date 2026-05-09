import { Toaster, ToastBar } from "react-hot-toast";

const WiredToaster = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{ duration: 3500 }}
    >
      {(t) => (
        <ToastBar toast={t} style={{ padding: 0, background: "transparent", boxShadow: "none" }}>
          {({ icon, message }) => {
            /* ── Variant class maps ── */
            const isSuccess = t.type === "success";
            const isError = t.type === "error";
            const isLoading = t.type === "loading";

            const containerClasses = [
              /* layout */
              "flex items-start gap-3",
              "px-4 py-3",
              "max-w-[360px] w-full",
              /* shape — square corners, no shadow */
              "rounded-none shadow-none",
              /* border */
              isError
                ? "border-2 border-[#e53e3e]"
                : isLoading
                  ? "border-2 border-[#e2e8f0]"
                  : "border-2 border-black",
              /* background */
              isSuccess ? "bg-black" : "bg-white",
            ].join(" ");

            const iconClasses = [
              "mt-0.5 shrink-0",
              /* invert icon on success to keep it legible on black bg */
              isSuccess ? "[&_svg]:stroke-white [&_svg]:fill-none" : "",
            ].join(" ");

            const eyebrowClasses = [
              /* WiredMono kicker above the message */
              "font-mono text-[11px] font-bold uppercase tracking-[1.2px] leading-none mb-1 block",
              isSuccess ? "text-white/60" : "text-[#757575]",
            ].join(" ");

            const messageClasses = [
              /* Apercu UI label */
              "font-sans text-[14px] font-normal tracking-[0.3px] leading-[1.29]",
              isSuccess ? "text-white" : isLoading ? "text-[#757575]" : "text-[#1a1a1a]",
            ].join(" ");

            /* Per-type kicker label */
            const kicker = isSuccess
              ? "SUCCESS"
              : isError
                ? "ERROR"
                : isLoading
                  ? "LOADING"
                  : "NOTICE";

            return (
              <div className={containerClasses}>
                {/* Icon */}
                <span className={iconClasses}>{icon}</span>

                {/* Text block */}
                <div className="flex flex-col min-w-0">
                  {/* WiredMono ALL-CAPS kicker */}
                  <span className={eyebrowClasses}>{kicker}</span>
                  {/* Message body */}
                  <span className={messageClasses}>{message}</span>
                </div>
              </div>
            );
          }}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default WiredToaster;
