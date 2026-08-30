/**
 * getRelativeTime
 */

export const getRelativeTime = (isoDate: string): string => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    return `Added ${years} year${years > 1 ? 's' : ''} ago`;
  }

  if (diffDays >= 30) {
    const months = Math.floor(diffDays / 30);
    return `Added ${months} month${months > 1 ? 's' : ''} ago`;
  }

  if (diffDays > 0) {
    return `Added ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  return 'Added today';
};
