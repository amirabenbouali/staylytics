function PriceKpiCard({ icon, label, value, detail }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#FFE8E9] text-[#FF5A5F]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#6B7280]">{label}</p>
          <strong className="mt-4 block text-3xl font-bold tracking-tight text-[#111827]">
            {value}
          </strong>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">{detail}</p>
        </div>
      </div>
    </article>
  )
}

export default PriceKpiCard
