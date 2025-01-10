export function getCurrentTimestamp(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}${minutes}${seconds}`;
}

export function getCurrentDateTimestamp(): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function randomNumber(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

export function randomTimestamp(): string {
  const stamp = getCurrentTimestamp();
  const rand = randomNumber(9999999);
  return `${stamp}${rand}`;
}

export function randomEmail(): string {
  const stamp = getCurrentDateTimestamp();
  const rand = randomNumber(999999);
  return `${stamp}_${rand}@email.com`;
}

