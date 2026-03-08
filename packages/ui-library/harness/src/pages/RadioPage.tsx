import { RadioGroup, RadioGroupItem } from '@bytesyze-ui/core/radio'

export default function RadioPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-3">Vertical</p>
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" label="Option 1" />
          <RadioGroupItem value="option2" label="Option 2" />
          <RadioGroupItem value="option3" label="Option 3" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-3">Horizontal</p>
        <RadioGroup defaultValue="small" orientation="horizontal">
          <RadioGroupItem value="small" label="Small" />
          <RadioGroupItem value="medium" label="Medium" />
          <RadioGroupItem value="large" label="Large" />
        </RadioGroup>
      </div>
    </div>
  )
}
