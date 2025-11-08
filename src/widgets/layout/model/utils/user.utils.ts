/**
 * Generates user initials from name
 * Takes first letter of each word and returns up to 2 characters
 * 
 * @param name - Full name string
 * @returns Initials (max 2 characters, uppercase)
 * 
 * @example
 * ```ts
 * getInitials("John Doe") // "JD"
 * getInitials("John Michael Smith") // "JM"
 * getInitials("john") // "J"
 * ```
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

