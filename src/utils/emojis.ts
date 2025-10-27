export function getObjectTypeEmoji(type: string): string {
  switch (type) {
    case 'site':
      return '🏠'
    case 'area':
      return '🚪'
    case 'container':
      return '📦'
    case 'item':
      return '⚫'
    default:
      return '❓'
  }
}