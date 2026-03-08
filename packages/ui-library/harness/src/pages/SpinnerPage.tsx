import { Spinner } from '@bytesyze-ui/core/spinner'

export default function SpinnerPage() {
  return (
    <div className="flex gap-4 items-center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  )
}
