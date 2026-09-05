/** Product analytics helper (PostHog). No-op safe when the tracker isn't loaded. */

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, props?: Record<string, unknown>) => void;
    };
  }
}

export function trackEvent(event: string, props?: Record<string, unknown>): void {
  try {
    window.posthog?.capture(event, props);
  } catch {
    // analytics must never break the page
  }
}
