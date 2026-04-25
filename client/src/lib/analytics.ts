import { useEffect } from "react";

// Google Analytics 4 Event Tracking
// Replace G-XXXXXXXXXX with your actual GA4 Measurement ID

const GA_ID = "G-XXXXXXXXXX";

interface GAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

export function useGA4() {
  const trackEvent = (event: GAEvent) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  };

  const trackPageView = (path: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", GA_ID, {
        page_path: path,
      });
    }
  };

  return { trackEvent, trackPageView };
}

// Pre-defined conversion events
export const GA_EVENTS = {
  // Form submissions
  CONSULTATION_SUBMIT: "consultation_submit",
  AI_GENERATE_DOCUMENT: "ai_generate_document",
  TEMPLATE_DOWNLOAD: "template_download",
  
  // CTA clicks
  CTA_CLICK: "cta_click",
  NAV_CLICK: "nav_click",
  
  // Engagement
  SCROLL_DEPTH: "scroll_depth",
  TIME_ON_PAGE: "time_on_page",
  
  // E-commerce (for Stripe)
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE_COMPLETE: "purchase_complete",
  PURCHASE_CANCEL: "purchase_cancel",
} as const;

// Hook for tracking page views on route change
export function useGAPageView() {
  const { trackPageView } = useGA4();
  
  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    trackPageView(path);
  }, [trackPageView]);
}
