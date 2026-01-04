// Vaqtni formatlash (sekund -> minut:sekund)
export function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return mins + ":" + (secs < 10 ? "0" : "") + secs;
}