// src/utils/time.util.ts
export const parseTimeStringToSeconds = (timeString: string): number => {
    const unit = timeString.slice(-1);
    const value = parseInt(timeString.slice(0, -1), 10);
  
    if (isNaN(value)) {
      return 3600; // Default to 1 hour if parsing fails
    }
  
    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        // If unit is not recognized, maybe it's a raw number of seconds
        const rawSeconds = parseInt(timeString, 10);
        return isNaN(rawSeconds) ? 3600 : rawSeconds;
    }
  };
  