'use client'

import React, { useMemo, useRef, useState } from 'react'

export default function OnlyUsedTeslaUK() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formRef = useRef<HTMLFormElement>(null)
  const startRef = useRef<HTMLDivElement>(null)

  function scrollToForm() {
    startRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postcode: '',
    registration: '',
    vin: '',
    model: '',
    year: '',
    mileage: '',
    condition: 'excellent',
    ownership: 'private',
    financeStatus: 'none',
    financeAmount: '',
    timeline: 'asap',
    notes: '',
    consent: false,
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const validators = useMemo(
    () => ({
      firstName: (v: string) => (!v ? 'Required' : ''),
      lastName: (v: string) => (!v ? 'Required' : ''),
      email: (v: string) => (/\S+@\S+\.\S+/.test(v) ? '' : 'Enter a valid email'),
      phone: (v: string) =>
        /^(\+?44|0)\s?\d{9,11}$/.test(v.replace(/\s|-/g, '')) ? '' : 'Enter a UK phone',
      postcode: (v: string) =>
        /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(v.trim()) ? '' : 'Enter a UK postcode',
      registration: (v: string) =>
        /^[A-Z0-9]{2,8}$/i.test(v.replace(/\s/g, '')) ? '' : 'Enter a UK reg (number plate)',
      model: (v: string) => (!v ? 'Select a model' : ''),
      year: (v: string) => (/^(20\d{2}|19\d{2})$/.test(v) ? '' : 'YYYY'),
      mileage: (v: string) => (/^\d{1,7}$/.test(v) ? '' : 'Digits only'),
      financeAmount: (_: string) => '',
      consent: (v: boolean) => (v ? '' : 'Consent required'),
    }),
    []
  )

  function normalise() {
    return {
      ...form,
      postcode: form.postcode.toUpperCase().replace(/\s+/g, '').replace(/(.{3})$/, ' $1'),
      registration: form.registration.toUpperCase().replace(/\s+/g, ''),
      model: form.model || 'Tesla (unspecified)',
    }
  }

  function validateAll() {
    const next: Record<string, string> = {}
    ;(['firstName','lastName','email','phone','postcode','registration','model','year','mileage','consent'] as const).forEach((k) => {
      // @ts-ignore
      const msg = validators[k](form[k])
      if (msg) next[k] = msg
    })
    if (form.financeStatus !== 'none' && form.financeAmount && !/^\d{1,8}$/.test(form.financeAmount)) {
      next.financeAmount = 'Digits only'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateAll()) return

    setSubmitting(true)
    const payload = normalise()

    try {
      console.log('[OnlyUsedTesla.co.uk] Lead payload:', payload)
      await new Promise((r) => setTimeout(r, 900))
      setSubmitted(true)
      formRef.current?.reset()
    } catch (err) {
      alert('Something went wrong. Please try again or WhatsApp us.')
    } finally {
      setSubmitting(false)
    }
  }

  const Input = ({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required,
    error,
    autoComplete,
    inputMode,
  }: {
    id: string
    label: string
    type?: string
    placeholder?: string
    value: string | number | readonly string[] | undefined
    onChange: (v: string) => void
    required?: boolean
    error?: string
    autoComplete?: string
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-400' : 'border-zinc-300'}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Request received
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Thanks! Your Tesla cash‑offer request is in.</h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-600">We’ll share your details with vetted UK buyers in our network and reply by SMS/WhatsApp typically within a few hours. No fees for sellers.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {['We contact UK buyers','You review offers','Free to the seller'].map((t) => (
              <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">{t}</div>
            ))}
          </div>
          <button onClick={() => { setSubmitted(false); scrollToForm() }} className="mt-10 rounded-2xl bg-indigo-600 px-5 py-3 text-white shadow hover:bg-indigo-500">Submit another Tesla</button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> OnlyUsedTesla.co.uk
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
            Get a <span className="text-indigo-600">cash offer</span> for your Tesla in the UK
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Tell us about your car and postcode. We invite verified UK buyers from our network to make an offer.
            You choose if you want to proceed. We earn from the buyer — never from the seller.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={scrollToForm} className="rounded-2xl bg-indigo-600 px-6 py-3 text-white shadow hover:bg-indigo-500">Start now</button>
            <a href="#how" className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 text-zinc-800 hover:bg-zinc-50">How it works</a>
          </div>
          <div className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {["UK‑wide coverage","No seller fees","Fast responses"].map((b) => (
              <div key={b} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 shadow-sm">{b}</div>
            ))}
          </div>
        </div>
      </header>

      <section id="how" className="mx-auto mt-16 max-w-6xl px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: '1) Share your details', body: 'Enter reg, mileage, and postcode. Tell us about condition and any finance.' },
            { title: '2) We invite offers', body: 'We ping verified Tesla buyers across the UK (trade only). They respond by SMS/WhatsApp or email.' },
            { title: '3) You choose', body: 'Accept an offer if it works for you. We are paid by the buyer. No obligation for sellers.' },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">{s.title}</div>
              <div className="mt-2 text-sm text-zinc-600">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={startRef} className="mx-auto mt-16 max-w-5xl px-6 pb-24">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-zinc-900">Start now — free for sellers</h2>
              <p className="mt-1 text-sm text-zinc-600">We’ll text you as soon as we have an offer. *Required fields.</p>
            </div>

            <form ref={formRef} onSubmit={onSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="firstName" label="First name" value={form.firstName} onChange={(v) => update('firstName', v)} required error={errors.firstName} autoComplete="given-name" />
                <Input id="lastName" label="Last name" value={form.lastName} onChange={(v) => update('lastName', v)} required error={errors.lastName} autoComplete="family-name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="email" label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} required error={errors.email} autoComplete="email" />
                <Input id="phone" label="Phone (UK)" value={form.phone} onChange={(v) => update('phone', v)} required error={errors.phone} autoComplete="tel" inputMode="tel" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="postcode" label="Postcode" value={form.postcode} onChange={(v) => update('postcode', v)} required error={errors.postcode} autoComplete="postal-code" />
                <Input id="registration" label="Registration (number plate)" value={form.registration} onChange={(v) => update('registration', v)} required error={errors.registration} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700">Tesla model<span className="text-red-500"> *</span></label>
                  <select
                    className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.model ? 'border-red-400' : 'border-zinc-300'}`}
                    value={form.model}
                    onChange={(e) => update('model', e.target.value)}
                  >
                    <option value="">Select…</option>
                    <option>Model 3</option>
                    <option>Model Y</option>
                    <option>Model S</option>
                    <option>Model X</option>
                    <option>Cybertruck</option>
                    <option>Roadster (2011–12)</option>
                    <option>Other / Unsure</option>
                  </select>
                  {errors.model && <p className="mt-1 text-xs text-red-600">{errors.model}</p>}
                </div>
                <Input id="year" label="Year (YYYY)" value={form.year} onChange={(v) => update('year', v)} required error={errors.year} inputMode="numeric" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="mileage" label="Mileage (mi)" value={form.mileage} onChange={(v) => update('mileage', v)} required error={errors.mileage} inputMode="numeric" />
                <Input id="vin" label="VIN (optional)" value={form.vin} onChange={(v) => update('vin', v)} placeholder="5YJ…" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700">Condition</label>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {[
                      { id: 'excellent', label: 'Excellent' },
                      { id: 'good', label: 'Good' },
                      { id: 'fair', label: 'Fair' },
                      { id: 'needs-work', label: 'Needs work' },
                    ].map((c) => (
                      <label key={c.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 ${form.condition === c.id ? 'border-indigo-500' : 'border-zinc-300'}`}>
                        <input type="radio" name="condition" className="hidden" checked={form.condition === c.id} onChange={() => update('condition', c.id)} />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700">Ownership</label>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {[
                      { id: 'private', label: 'Private seller' },
                      { id: 'business', label: 'Business' },
                    ].map((c) => (
                      <label key={c.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 ${form.ownership === c.id ? 'border-indigo-500' : 'border-zinc-300'}`}>
                        <input type="radio" name="ownership" className="hidden" checked={form.ownership === c.id} onChange={() => update('ownership', c.id)} />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700">Outstanding finance</label>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'hp', label: 'HP/PCP — I owe' },
                    { id: 'lease', label: 'Lease' },
                  ].map((c) => (
                    <label key={c.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 ${form.financeStatus === c.id ? 'border-indigo-500' : 'border-zinc-300'}`}>
                      <input type="radio" name="finance" className="hidden" checked={form.financeStatus === c.id} onChange={() => update('financeStatus', c.id as any)} />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
                {form.financeStatus === 'hp' && (
                  <div className="mt-3 max-w-xs">
                    <Input id="financeAmount" label="Approx. payoff (£)" value={form.financeAmount} onChange={(v) => update('financeAmount', v)} error={errors.financeAmount} inputMode="numeric" />
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700">Timeline</label>
                  <select className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={form.timeline} onChange={(e) => update('timeline', e.target.value as any)}>
                    <option value="asap">ASAP (0–3 days)</option>
                    <option value="week">Within a week</option>
                    <option value="month">Within a month</option>
                    <option value="just-looking">Just checking prices</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700">Notes (optional)</label>
                  <textarea rows={3} className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Mods, damage, service history, extra info…" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
                </div>
              </div>

              <label className="mb-4 flex items-start gap-3 text-sm text-zinc-700">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-zinc-300" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} />
                <span>I agree to be contacted about my offer request by SMS/WhatsApp/email. I’m the legal owner or authorised to sell this vehicle.</span>
              </label>
              {errors.consent && <p className="-mt-3 mb-3 text-xs text-red-600">{errors.consent}</p>}

              <button type="submit" disabled={submitting} className="mt-2 w-full rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white shadow hover:bg-indigo-500 disabled:opacity-50">{submitting ? 'Submitting…' : 'Get my cash offer'}</button>

              <p className="mt-3 text-xs text-zinc-500">By submitting, you consent to us sharing your vehicle details with vetted UK buyers to obtain offers. We are paid by the buyer. No seller fees.</p>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">Why sellers use us</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600">
                <li>Fast offers from trade buyers who know Teslas</li>
                <li>UK‑wide coverage; collect from your postcode</li>
                <li>No haggling with tire‑kickers; no seller fees</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">How we make money</div>
              We charge the buying dealer, not the seller. If you accept an offer, we may earn a fee from the buyer.
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">Questions?</div>
              Email <a className="text-indigo-600 underline" href="mailto:team@onlyusedtesla.co.uk">team@onlyusedtesla.co.uk</a> or WhatsApp us.
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white/60 py-10 text-center text-sm text-zinc-600">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-2 font-medium text-zinc-800">OnlyUsedTesla.co.uk</div>
          <div className="opacity-80">© {new Date().getFullYear()} Only Used Tesla — UK cash‑offer network for Teslas. All trademarks belong to their owners.</div>
          <div className="mt-2 space-x-4">
            <a className="underline" href="#">Privacy</a>
            <a className="underline" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
