/**
 * Generates a random color from a predefined palette of professional colors
 * @param seed Optional string to generate consistent colors for the same user
 * @returns An object with color information
 */
export function generateAvatarColor(seed?: string) {
  // Professional color palette (pastel/muted colors that work well as backgrounds)
  const colors = [
    { bg: "#E9D5FF", fg: "#581C87" }, // Purple
    { bg: "#DBEAFE", fg: "#1E40AF" }, // Blue
    { bg: "#D1FAE5", fg: "#065F46" }, // Green
    { bg: "#FEF3C7", fg: "#92400E" }, // Amber
    { bg: "#FFEDD5", fg: "#9A3412" }, // Orange
    { bg: "#FEE2E2", fg: "#991B1B" }, // Red
    { bg: "#E0E7FF", fg: "#3730A3" }, // Indigo
    { bg: "#F3E8FF", fg: "#6B21A8" }, // Violet
    { bg: "#CCFBF1", fg: "#0F766E" }, // Teal
    { bg: "#F5F5F5", fg: "#404040" }, // Neutral
  ]

  let index = 0

  if (seed) {
    // Generate a consistent color based on the seed string
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    }
    index = Math.abs(hash) % colors.length
  } else {
    // Random color if no seed is provided
    index = Math.floor(Math.random() * colors.length)
  }

  return {
    background: colors[index].bg,
    foreground: colors[index].fg,
    colorIndex: index,
  }
}

/**
 * Gets the initials from a name
 * @param name The full name to extract initials from
 * @returns Up to two characters representing the initials
 */
export function getInitials(name: string): string {
  if (!name) return "?"

  const parts = name.trim().split(/\s+/)

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
