import { CONTACT_EMAIL } from '../data/brand'

const endpoint = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`

export type FormSubmitPayload = Record<string, string | number | boolean | undefined>

const MAX_FIELD = 4000

/** Send a form payload to FormSubmit. First use requires confirming the inbox email. */
export async function sendFormSubmit(payload: FormSubmitPayload): Promise<void> {
  const body: Record<string, string> = {
    _template: 'table',
    _captcha: 'false',
    // FormSubmit honeypot — must stay empty; bots that fill it get dropped server-side
    _honey: '',
  }

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === '') continue
    body[key] = String(value).slice(0, MAX_FIELD)
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`FormSubmit failed (${res.status})`)
  }

  // FormSubmit returns JSON on success; some error paths still return 200 with a message.
  const data = (await res.json().catch(() => null)) as { success?: string | boolean; message?: string } | null
  if (data && data.success === false) {
    throw new Error(data.message || 'FormSubmit rejected the submission')
  }
}
