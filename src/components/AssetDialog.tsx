'use client'

import { useEffect, useRef } from 'react'

export function AssetDialog({ titleId, busy, onClose, children }: {
  titleId: string; busy: boolean; onClose: () => void; children: React.ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const dialog = ref.current!
    dialog.showModal()
    dialog.querySelector<HTMLElement>('[autofocus], input, select, textarea')?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus() }
  }, [])
  return <dialog ref={ref} aria-labelledby={titleId} aria-busy={busy} onCancel={e => { e.preventDefault(); if (!busy) onClose() }} onClick={e => { if (e.target === e.currentTarget && !busy) onClose() }} className="asset-dialog ledger-dialog fixed inset-0 m-auto w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 shadow-xl backdrop:bg-black/35">{children}</dialog>
}
