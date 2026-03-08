import { Switch } from '@bytesyze-ui/core/switch'

export default function SwitchPage() {
  return (
    <div className="space-y-2">
      <Switch label="Enable notifications" />
      <Switch label="Auto-save" defaultChecked />
    </div>
  )
}
