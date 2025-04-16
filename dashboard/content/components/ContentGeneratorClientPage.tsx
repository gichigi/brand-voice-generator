  if (contentType === "linkedin-post") {
    contentPrompt = `
Create a ${contentLength} LinkedIn post about "${topic}".

LINKEDIN POST FORMAT REQUIREMENTS:
1. Start with an attention-grabbing emoji + headline
2. Use very short paragraphs (1-2 sentences each)
3. Include 3-5 paragraphs maximum
4. Add 1-2 relevant emojis at paragraph beginnings
5. End with a clear call-to-action 
6. Add 3-5 relevant hashtags at the end
7. Total length: ${contentLength === "short" ? "100-150" : contentLength === "medium" ? "200-250" : "300-350"} words
8. NO lengthy introductions or conclusions
9. Format as plain text, not HTML

${keywords ? `Include these keywords naturally: ${keywords}` : ""}
${customContext ? `Professional Context: ${customContext}` : ""}
`;
  } 