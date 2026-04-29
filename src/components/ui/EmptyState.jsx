function EmptyState({ title = 'No data found', message = 'Try adjusting the filters to broaden the view.' }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#DED8CF] bg-white/70 p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FFF0F0] text-[#FF5A5F]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#111827]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{message}</p>
    </div>
  )
}

export default EmptyState
