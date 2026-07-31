import { leadDelivery } from '../content';

export interface Lead {
  name: string;
  phone: string;
  /** Удобное время звонка, необязательное поле. */
  time: string;
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'failed'; message?: string };

/** Письмо на почту через FormSubmit — сервис без регистрации. */
async function sendByEmail(lead: Lead): Promise<SubmitResult> {
  if (!leadDelivery.email) return { ok: false, reason: 'not-configured' };

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(leadDelivery.email)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Заявка с сайта «Солнечный Луг» — ${lead.name}`,
        _template: 'table',
        // Отключает страницу-заглушку капчи: для ajax она только мешает.
        _captcha: 'false',
        Имя: lead.name,
        Телефон: lead.phone,
        'Удобное время звонка': lead.time || 'не указано',
      }),
    }
  );

  if (!response.ok) {
    return { ok: false, reason: 'failed', message: `HTTP ${response.status}` };
  }

  // FormSubmit отвечает 200 даже на отказ, причина — только в теле ответа.
  const data = (await response.json().catch(() => null)) as {
    success?: unknown;
    message?: unknown;
  } | null;

  if (data && String(data.success) === 'true') return { ok: true };

  return {
    ok: false,
    reason: 'failed',
    message:
      typeof data?.message === 'string' ? data.message : 'сервис не принял заявку',
  };
}

/**
 * Запись в Google-форму. Google не отдаёт CORS-заголовки, поэтому запрос уходит
 * в режиме no-cors: ответ прочитать нельзя, ошибку сети — можно.
 */
async function sendToGoogleForm(lead: Lead): Promise<SubmitResult> {
  const { actionUrl, fields } = leadDelivery.googleForm;
  if (!actionUrl || !fields.name || !fields.phone) {
    return { ok: false, reason: 'not-configured' };
  }

  const body = new FormData();
  body.append(fields.name, lead.name);
  body.append(fields.phone, lead.phone);
  if (fields.time && lead.time) body.append(fields.time, lead.time);

  await fetch(actionUrl, { method: 'POST', mode: 'no-cors', body });
  return { ok: true };
}

async function sendToCustomEndpoint(lead: Lead): Promise<SubmitResult> {
  if (!leadDelivery.customEndpoint) return { ok: false, reason: 'not-configured' };

  const response = await fetch(leadDelivery.customEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(lead),
  });

  return response.ok ? { ok: true } : { ok: false, reason: 'failed' };
}

/** Отправляет заявку туда, куда указано в leadDelivery.mode. */
export async function submitLead(lead: Lead): Promise<SubmitResult> {
  try {
    switch (leadDelivery.mode) {
      case 'email':
        return await sendByEmail(lead);
      case 'google-form':
        return await sendToGoogleForm(lead);
      case 'custom':
        return await sendToCustomEndpoint(lead);
      default:
        return { ok: false, reason: 'not-configured' };
    }
  } catch {
    return { ok: false, reason: 'failed' };
  }
}
