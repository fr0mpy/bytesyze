import { Carousel } from '@bytesyze-ui/core/carousel'

export default function CarouselPage() {
  const items = [
    <div key="1" className="flex items-center justify-center h-64 bg-primary/10 rounded-theme-lg">
      <p className="text-lg font-semibold">Slide 1</p>
    </div>,
    <div key="2" className="flex items-center justify-center h-64 bg-secondary/10 rounded-theme-lg">
      <p className="text-lg font-semibold">Slide 2</p>
    </div>,
    <div key="3" className="flex items-center justify-center h-64 bg-accent/10 rounded-theme-lg">
      <p className="text-lg font-semibold">Slide 3</p>
    </div>,
  ]

  return <Carousel items={items} />
}
