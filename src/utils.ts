export function addTimeToReminder(reminder: Date | undefined, hoursToAdd: number, minutesToAdd: number): Date | undefined {
    if (!reminder) {
      return undefined;
    }
    
    // Create a new Date object to avoid mutating the original date
    const adjustedReminder = new Date(reminder);
  
    // Add hours and minutes
    adjustedReminder.setHours(adjustedReminder.getHours() + hoursToAdd);
    adjustedReminder.setMinutes(adjustedReminder.getMinutes() + minutesToAdd);
  
    return adjustedReminder;
  }