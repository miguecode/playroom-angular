export function emailValidator(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function minLengthValidator(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

export function userValidator(value: string): boolean {
  const minLength = 4;
  const maxLength = 20;
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  if (value.length < minLength || value.length > maxLength) {
    return false;
  }

  return usernameRegex.test(value);
}