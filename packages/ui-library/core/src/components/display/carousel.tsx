'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { CarouselStyles as S } from './styles'
import { ARIA } from '../../config'

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[]
  showIndicators?: boolean
  ref?: React.Ref<HTMLDivElement>
}

function Carousel({ items, showIndicators = true, className, ref, ...props }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  return (
    <div
      ref={ref}
      className={cn(S.root, className)}
      {...props}
    >
      <div className={S.viewport}>
        <div
          className={S.track}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className={S.slide}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className={cn(S.navButton.base, S.navButton.prev)}
        aria-label={ARIA.previousSlide}
      >
        <ChevronLeft className={S.navButtonIcon} />
      </button>

      <button
        onClick={goToNext}
        className={cn(S.navButton.base, S.navButton.next)}
        aria-label={ARIA.nextSlide}
      >
        <ChevronRight className={S.navButtonIcon} />
      </button>

      {showIndicators && (
        <div className={S.indicators.container}>
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                S.indicators.dot.base,
                index === currentIndex
                  ? S.indicators.dot.active
                  : S.indicators.dot.inactive,
              )}
              aria-label={ARIA.goToSlide(index + 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { Carousel }
