import { Mail, Search } from 'lucide-react'
import { Input } from '@bytesyze-ui/core/input'

export default function InputPage() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <Input placeholder="Basic input" />
      <Input placeholder="With left icon" leftIcon={<Mail className="h-4 w-4" />} />
      <Input placeholder="With right icon" rightIcon={<Search className="h-4 w-4" />} />
      <Input placeholder="Error state" error helperText="This field is required" />
      <Input placeholder="Success state" success helperText="Looks good!" />
    </div>
  )
}
