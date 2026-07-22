/** Client-side guards for contact/order forms (defense in depth; FormSubmit still receives sanitized strings). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export function isValidEmail(email: string): boolean {
  if (email.length < 5 || email.length > 254) return false
  return EMAIL_RE.test(email)
}

export function clampText(value: string, max: number): string {
  return value.trim().slice(0, max)
}

export function validateContactFields(input: {
  name: string
  email: string
  message: string
}): string | null {
  const name = clampText(input.name, 120)
  const email = clampText(input.email, 254)
  const message = clampText(input.message, 4000)
  if (name.length < 2) return 'Add your name.'
  if (!isValidEmail(email)) return 'Enter a valid email.'
  if (message.length < 5) return 'Tell us a bit more in the message.'
  return null
}

export function validateOrderFields(input: {
  name: string
  email: string
  discord: string
  server: string
  notes: string
}): string | null {
  const name = clampText(input.name, 120)
  const email = clampText(input.email, 254)
  const discord = clampText(input.discord, 80)
  if (name.length < 2) return 'Add your name.'
  if (!isValidEmail(email)) return 'Enter a valid email.'
  if (discord.length < 2) return 'Add your Discord username.'
  if (clampText(input.server, 500).length > 500) return 'Server link is too long.'
  if (clampText(input.notes, 4000).length > 4000) return 'Notes are too long.'
  return null
}
