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
    expect(screen.getByText(`${tamamlanan} / ${toplam} tamamlandı`)).toBeInTheDocument()
    const bar = screen.getByRole('progressbar', { name: /öğrenme listesi ilerlemesi/i })
    expect(bar).toHaveAttribute('aria-valuenow', String(oran))
    expect(screen.getAllByRole('listitem')).toHaveLength(toplam)
  })
})
