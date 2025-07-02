import { formatDistanceToNow, format } from 'date-fns'

export const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatDate = (date, pattern = 'MMM d, yyyy') => {
  return format(new Date(date), pattern)
}

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const formatHashtags = (text) => {
  return text.replace(/#(\w+)/g, '<span class="text-primary font-medium">#$1</span>')
}

export const formatMentions = (text) => {
  return text.replace(/@(\w+)/g, '<span class="text-primary font-medium">@$1</span>')
}