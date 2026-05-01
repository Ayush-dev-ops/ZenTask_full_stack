const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

function nameToColor(name = '') {
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return `hsl(${hue}, 55%, 52%)`
}

function initials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md
  return (
    <div
      title={name}
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ring-2 ring-black/10 ${className}`}
      style={{ background: nameToColor(name) }}
    >
      {initials(name)}
    </div>
  )
}

export function AvatarGroup({ names = [], max = 3, size = 'sm' }) {
  const visible = names.slice(0, max)
  const extra = names.length - max
  return (
    <div className="flex -space-x-2">
      {visible.map((name, i) => (
        <Avatar key={i} name={name} size={size} className="ring-2 ring-black/20" />
      ))}
      {extra > 0 && (
        <div
          className={`${SIZE_CLASSES[size]} rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-black/20`}
          style={{ background: 'rgba(99,102,241,0.3)', color: '#c7d2fe' }}
        >
          +{extra}
        </div>
      )}
    </div>
  )
}
