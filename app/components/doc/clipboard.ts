"use client";

export async function copyTextToClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            // Fall back to execCommand below for browsers or permissions that
            // reject Clipboard API writes from docs preview controls.
        }
    }

    if (copyTextWithSelection(text)) {
        return;
    }

    throw new Error("Unable to copy text");
}

function copyTextWithSelection(text: string) {
    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.inset = "0 auto auto 0";
    textarea.style.width = "1px";
    textarea.style.height = "1px";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    try {
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        document.body.removeChild(textarea);
        activeElement?.focus({ preventScroll: true });
        window.scrollTo(scrollX, scrollY);
    }
}
