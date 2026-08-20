declare global {
    interface Window {
        gtag?: (
            command: "event",
            eventName: string,
            params?: Record<string, unknown>,
        ) => void;
    }
}

export const trackEvent = (
    eventName: string,
    params: Record<string, unknown> = {},
): void => {
    window.gtag?.("event", eventName, {
        ...params,
        page_path: window.location.pathname,
    });
};