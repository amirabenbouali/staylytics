function PageHeader({ title, subtitle, eyebrow, action, accent = '#FF5A5F' }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow ? (
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.18em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B7280]">{subtitle}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}

export default PageHeader
