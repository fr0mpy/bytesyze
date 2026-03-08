import { Button } from '@bytesyze-ui/core/button'
import { ToastProvider, useToast } from '@bytesyze-ui/core/toast'

function ToastDemoContent() {
  const { addToast } = useToast()
  const variants = ['info', 'success', 'warning', 'destructive'] as const

  const gridPositions = [
    ['top-left', 'top', 'top-right'],
    ['left', null, 'right'],
    ['bottom-left', 'bottom', 'bottom-right'],
  ] as const

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground mb-2">Click to show toast at each position</p>
      <div className="grid grid-cols-3 gap-2 max-w-xs">
        {gridPositions.flat().map((position, idx) =>
          position ? (
            <Button
              key={position}
              variant="text"
              size="sm"
              onClick={() =>
                addToast({
                  variant: variants[Math.floor(Math.random() * variants.length)],
                  position,
                  title: position.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                  description: `Toast from ${position}`,
                  duration: 3000,
                })
              }
            >
              {position}
            </Button>
          )
            : <div key={idx} />,

        )}
      </div>
    </div>
  )
}

export default function ToastPage() {
  return (
    <ToastProvider>
      <ToastDemoContent />
    </ToastProvider>
  )
}
