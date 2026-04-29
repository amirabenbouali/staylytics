function SurfaceCard({ as: Component = 'article', className = '', children }) {
  return (
    <Component
      className={`rounded-2xl border border-[#ECE7DF] bg-white shadow-[0_14px_40px_rgba(17,24,39,0.06)] transition-shadow hover:shadow-[0_18px_48px_rgba(17,24,39,0.09)] ${className}`}
    >
      {children}
    </Component>
  )
}

export default SurfaceCard
