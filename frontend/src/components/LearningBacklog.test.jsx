import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LearningBacklog from './LearningBacklog.jsx'
import { learningBacklog } from '../data/content.js'

describe('<LearningBacklog />', () => {
  it('tamamlanan/toplam sayısını ve ilerleme oranını veriden türetir', () => {
    render(<LearningBacklog />)

    const toplam = learningBacklog.length
    const tamamlanan = learningBacklog.filter((o) => o.done).length
    const oran = Math.round((tamamlanan / toplam) * 100)

    // Özet metni elle yazılmaz, veriden türetilir → "X / Y tamamlandı"
    expect(screen.getByText(`${tamamlanan} / ${toplam} tamamlandı`)).toBeInTheDocument()

    // Progressbar oranı da aynı veriden türetilmiş olmalı
    const bar = screen.getByRole('progressbar', { name: /öğrenme listesi ilerlemesi/i })
    expect(bar).toHaveAttribute('aria-valuenow', String(oran))

    // Her hedef için bir liste satırı render edilir
    expect(screen.getAllByRole('listitem')).toHaveLength(toplam)
  })
})
