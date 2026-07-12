import { type JSX } from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface LoadingSpinnerProps {
  message?: string;
  size?: SpinnerSize;
  fullScreen?: boolean;
  asOverlay?: boolean;
  inline?: boolean;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-[4px]",
  xl: "w-16 h-16 border-[4px]",
};

function SpinnerIcon({ size, inline = false }: { size: SpinnerSize; inline?: boolean }) {
  if (inline) {
    return (
      <span
        className={`${sizeClasses[size]} inline-block rounded-full border-primary/25 border-t-primary animate-spin`}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-primary/25 border-t-primary animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingSpinner({
  message = "Loading data...",
  size = "md",
  fullScreen = false,
  asOverlay = false,
  inline = false,
}: LoadingSpinnerProps): JSX.Element {
  if (inline) {
    return (
      <span className="inline-flex items-center gap-2 text-primary">
        <SpinnerIcon size={size === "xl" ? "sm" : size === "lg" ? "sm" : size} inline />
        {message && (
          <span className="text-[13px] font-medium text-muted-foreground">
            {message}
          </span>
        )}
      </span>
    );
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <SpinnerIcon size={size} />
        {message && (
          <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <SpinnerIcon size={size} />
      {message && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (asOverlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
        {content}
      </div>
    );
  }

  return content;
}
