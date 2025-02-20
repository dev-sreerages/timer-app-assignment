import { toast } from "sonner";

export interface TimerFormData {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export const validateTimerForm = (data: TimerFormData): boolean => {
  const { title, hours, minutes, seconds } = data;

  if (!title.trim()) {
    toast.error("Please enter a title for the timer.");
    return false;
  }

  if (title.length > 50) {
    toast.error("Title should not exceed 50 characters.");
    return false;
  }

  if (hours < 0 || minutes < 0 || seconds < 0) {
    toast.error("Time values must be positive numbers.");
    return false;
  }

  if (minutes > 59 || seconds > 59) {
    toast.error("Minutes and seconds must be between 0 and 59.");
    return false;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds === 0) {
    toast.error("Timer must be set to at least 1 second.");
    return false;
  }

  if (totalSeconds > 86400) {
    // 24 hours
    toast.error("Maximum allowed duration is 24 hours.");
    return false;
  }

  return true;
};
