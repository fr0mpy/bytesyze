import { NumberInput } from '@bytesyze-ui/core/number-input'

export default function NumberInputPage() {
  return (
    <div className="space-y-4 w-full max-w-xs">
      <NumberInput label="Quantity" defaultValue={1} min={0} max={100} />
      <NumberInput label="Price" defaultValue={25} step={5} helperText="In increments of 5" />
      <NumberInput label="With bounds" defaultValue={50} min={0} max={100} helperText="Min: 0, Max: 100" />
      <NumberInput label="Disabled" defaultValue={10} disabled />
    </div>
  )
}
