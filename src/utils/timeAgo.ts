export default function timeAgo(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diff / (1000 * 60))
  const diffHours = Math.floor(diff / (1000 * 60 * 60))
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffMinutes === 0) {
    return "just now"
  }

  if (diffMinutes === 1) {
    return "a minute ago"
  }

  if (diffHours === 0) {
    return `${diffMinutes} minutes ago`
  }

  if (diffHours === 1) {
    return "an hour ago"
  }

  if (diffDays === 0) {
    return `${diffHours} hours ago`
  }

  if (diffDays === 1) {
    return "yesterday"
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`
  }

  if (diffWeeks === 1) {
    return "last week"
  }

  if (diffWeeks < 5) {
    return `${diffWeeks} weeks ago`
  }

  if (diffMonths === 1) {
    return "last month"
  }

  if (diffMonths < 12) {
    return `${diffMonths} months ago`
  }

  if (diffYears === 1) {
    return "last year"
  }

  return `${diffYears} years ago`
}
