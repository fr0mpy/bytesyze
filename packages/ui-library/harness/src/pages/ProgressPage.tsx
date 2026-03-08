import { useState, useEffect } from 'react'
import { Progress } from '@bytesyze-ui/core/progress'

export default function ProgressPage() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 1))
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-md">
      <Progress value={value} />
    </div>
  )
}
