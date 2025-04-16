import { BrandVoiceHighlight } from "./types"

// Function to apply highlights to HTML content
export function applyHighlightsToHtml(html: string, highlights: BrandVoiceHighlight[]): string {
  if (!html || !highlights.length) return html;
  
  console.log("[applyHighlightsToHtml] Input:", { htmlLength: html.length, highlights: highlights.length });
  
  let highlightedHtml = html;
  
  // Sort highlights by length (longest first) to avoid nested highlights
  const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);
  
  for (const highlight of sortedHighlights) {
    try {
      if (!highlight.text || highlight.text.length < 3) {
        console.warn("[applyHighlightsToHtml] Skipping highlight with too short text:", highlight.text);
        continue;
      }
      
      console.log(`[applyHighlightsToHtml] Processing highlight: "${highlight.text.substring(0, 30)}${highlight.text.length > 30 ? '...' : ''}" (Pillar ${highlight.pillarIndex})`);
      
      // Create a unique ID for this highlight
      const highlightId = highlight.id || `highlight-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      // Escape special regex characters in the text
      const escapedText = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Normalize pillar index to ensure it's in the range 0-2 (for our 3 pillar colors)
      const rawPillarIndex = Number(highlight.pillarIndex);
      
      // First validate it's a number, use 0 as default
      const validPillarIndex = !isNaN(rawPillarIndex) && rawPillarIndex >= 0 
        ? rawPillarIndex 
        : 0;
      
      // Then ensure it's in the 0-2 range by using modulo 3
      const normalizedPillarIndex = validPillarIndex % 3;
      
      console.log(`[applyHighlightsToHtml] Normalized pillar index from ${rawPillarIndex} to ${normalizedPillarIndex}`);
      
      // Create the HTML for the highlighted span with pillar-specific class
      const highlightHtml = `<span class="brand-voice-highlight pillar-${normalizedPillarIndex}" title="${highlight.explanation}" data-highlight-id="${highlightId}" data-pillar-index="${normalizedPillarIndex}">${highlight.text}</span>`;
      
      // Replace only if the text exists in the HTML
      if (new RegExp(escapedText, 'i').test(highlightedHtml)) {
        highlightedHtml = highlightedHtml.replace(new RegExp(escapedText, 'gi'), highlightHtml);
        console.log(`[applyHighlightsToHtml] Highlighted text for pillar ${normalizedPillarIndex} (original: ${validPillarIndex})`);
      } else {
        console.warn(`[applyHighlightsToHtml] Text not found in content: "${highlight.text.substring(0, 30)}${highlight.text.length > 30 ? '...' : ''}"`);
      }
    } catch (error) {
      console.error(`[applyHighlightsToHtml] Error processing highlight:`, error);
    }
  }
  
  return highlightedHtml;
}

// Helper function to escape special characters in a string for use in a RegExp
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
