import { useRef, useState, type FormEvent } from 'react';
import { Check, Phone } from 'lucide-react';
import Reveal from './Reveal';
import Section from './Section';
import { contacts, finalCta } from '../content';
import { submitLead } from '../lib/submitLead';

type Errors = { name?: string; phone?: string };
type Status = 'idle' | 'sending' | 'sent' | 'error';

function validate(values: { name: string; phone: string }): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) {
    errors.name = 'Укажите, как к вам обращаться';
  }

  const digits = values.phone.replace(/\D/g, '');
  if (!digits) {
    errors.phone = 'Без телефона мы не сможем перезвонить';
  } else if (digits.length < 10) {
    errors.phone = 'Похоже, номер неполный — нужно минимум 10 цифр';
  }

  return errors;
}

/** Человек не заполняет форму быстрее этого, мс. */
const MIN_FILL_TIME = 2500;

export default function ContactForm() {
  const [values, setValues] = useState({ name: '', phone: '', time: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  /** Поле-приманка: человек его не видит, боты заполняют все поля подряд. */
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(Date.now());

  const setField = (field: keyof typeof values) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: value }));
    }
  };

  // Проверяем на blur, а не на каждый символ: не ругаемся на недописанный номер.
  const handleBlur = (field: keyof typeof values) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, phone: true });

    if (found.name) {
      nameRef.current?.focus();
      return;
    }
    if (found.phone) {
      phoneRef.current?.focus();
      return;
    }

    // Заполненная приманка или мгновенная отправка — почти наверняка бот.
    // Показываем успех, но никуда не отправляем: пусть не подбирает обход.
    const looksAutomated =
      Boolean(honeypotRef.current?.value) ||
      Date.now() - mountedAt.current < MIN_FILL_TIME;

    if (looksAutomated) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    const result = await submitLead(values);

    if (result.ok) {
      setStatus('sent');
      return;
    }

    // Посетителю показываем телефон, владельцу сайта — точную причину в консоли.
    if (result.reason === 'not-configured') {
      console.warn(
        'Заявки никуда не уходят: leadDelivery в src/content.ts не настроен. См. README, раздел «Куда приходят заявки».'
      );
    } else if (result.message?.includes('Activation')) {
      console.warn(
        `Заявка не отправлена: форма ещё не активирована. На ${contacts.email} пришло письмо от FormSubmit со ссылкой «Activate Form» — откройте её один раз, после этого заявки начнут доходить.`
      );
    } else {
      console.error('Заявка не отправлена:', result.message ?? 'неизвестная ошибка');
    }

    setStatus('error');
  };

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-lg border bg-white/5 px-4 py-3 text-base text-white placeholder-gray-500 transition-colors duration-200 ${
      hasError ? 'border-red-400' : 'border-white/15 focus:border-white/40'
    }`;

  return (
    <Section id="contact" eyebrow="Показ" title={finalCta.title}>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div>
            <p className="text-lg leading-relaxed text-gray-300">{finalCta.text}</p>

            <a
              href={contacts.phoneHref}
              className="mt-8 inline-flex cursor-pointer items-center gap-3 text-2xl font-light tracking-tight transition-colors duration-200 hover:text-gray-300 md:text-3xl"
            >
              <Phone size={22} strokeWidth={1.5} aria-hidden="true" />
              {contacts.phone}
            </a>
          </div>
        </Reveal>

        <Reveal delay={80}>
          {status === 'sent' ? (
            <div className="panel flex h-full flex-col items-start justify-center rounded-2xl p-8">
              <Check size={32} strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-light">Заявка отправлена</h3>
              <p className="mt-2 text-gray-400">
                Свяжемся с вами в ближайшее время и согласуем удобное время показа.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="panel rounded-2xl p-8">
              {/* Приманка для ботов: скрыта от глаз и от экранных дикторов,
                  исключена из порядка табуляции и из автозаполнения. */}
              <input
                ref={honeypotRef}
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-gray-300">
                    Имя <span className="text-gray-500">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => setField('name')(e.target.value)}
                    onBlur={handleBlur('name')}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={fieldClass(Boolean(errors.name))}
                    placeholder="Как к вам обращаться"
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-2 text-sm text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm text-gray-300">
                    Телефон <span className="text-gray-500">*</span>
                  </label>
                  <input
                    ref={phoneRef}
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(e) => setField('phone')(e.target.value)}
                    onBlur={handleBlur('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={fieldClass(Boolean(errors.phone))}
                    placeholder="+7 900 000-00-00"
                  />
                  {errors.phone && (
                    <p id="phone-error" role="alert" className="mt-2 text-sm text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="time" className="mb-2 block text-sm text-gray-300">
                    Удобное время звонка
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="text"
                    value={values.time}
                    onChange={(e) => setField('time')(e.target.value)}
                    className={fieldClass(false)}
                    placeholder="Например, будни после 18:00"
                  />
                  <p className="mt-2 text-sm text-gray-500">Необязательно</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-8 w-full cursor-pointer rounded-lg bg-white px-8 py-3.5 font-medium text-black transition-colors duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === 'sending' ? 'Отправляем…' : finalCta.button}
              </button>

              {status === 'error' && (
                <p role="alert" className="mt-4 text-sm text-red-400">
                  Не удалось отправить заявку. Позвоните нам:{' '}
                  <a href={contacts.phoneHref} className="underline underline-offset-2">
                    {contacts.phone}
                  </a>
                </p>
              )}

              <p className="mt-4 text-xs leading-relaxed text-gray-500">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
