export const truncateText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '... See more';
};

export const getMoodEmoji = (mood: string) => {
  switch (mood) {
    case 'great': return '😄';
    case 'good': return '🙂';
    case 'okay': return '😐';
    case 'struggling': return '😣';
    default: return '💭';
  }
};

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'bloom': return '🌸';
    case 'prune': return '✂️';
    case 'reflection': return '🌼';
    default: return '🌱';
  }
};

export const getTypeBadge = (type: string) => {
  switch (type) {
    case 'bloom': return 'Bloom';
    case 'prune': return 'Prune';
    case 'reflection': return 'Reflection';
    default: return 'Post';
  }
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
