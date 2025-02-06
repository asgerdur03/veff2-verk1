export function escapeHtml(text) {
    // svo að html í spurningum byrtist sem texti en ekki html, chat
    if (typeof text !== "string") {
        return String(text || ""); // Convert undefined/null to empty string
    }
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
