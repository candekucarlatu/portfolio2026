import clsx from 'clsx'
import type { NoteColor } from '@/lib/content/schema'

const noteStyles: Record<NoteColor, string> = {
  green: 'bg-note-green',
  blue: 'bg-note-blue',
  orange: 'bg-note-orange',
  purple: 'bg-note-purple',
}

const lineStyles: Record<NoteColor, string> = {
  green: 'bg-note-green-line',
  blue: 'bg-note-blue-line',
  orange: 'bg-note-orange-line',
  purple: 'bg-note-purple-line',
}

interface StickyNoteProps {
  title: string
  subtitle: string
  color: NoteColor
  className?: string
}

export function StickyNote({ title, subtitle, color, className }: StickyNoteProps) {
  return (
    <div
      className={clsx(
        'shadow-note text-ink flex h-full w-full flex-col gap-2 overflow-hidden p-4',
        noteStyles[color],
        className,
      )}
    >
      <h3 className="font-script text-[18px] leading-[1.15] font-bold tracking-tight">{title}</h3>
      <div className="relative flex-1">
        <p className="font-script text-[15px] leading-[1.35] font-normal">{subtitle}</p>
        <div
          className={clsx('absolute inset-x-0 -bottom-1 h-px opacity-30', lineStyles[color])}
          aria-hidden
        />
        <div
          className={clsx('absolute inset-x-1.5 -bottom-3 h-px opacity-30', lineStyles[color])}
          aria-hidden
        />
      </div>
    </div>
  )
}
