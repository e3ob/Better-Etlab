import { clsx, type ClassValue } from "clsx"
import { TZDate } from "react-day-picker"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDate() {
  return TZDate.tz("Asia/kolkata")
}