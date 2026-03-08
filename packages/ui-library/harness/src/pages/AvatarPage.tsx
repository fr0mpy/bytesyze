import { Avatar } from '@bytesyze-ui/core/avatar'

export default function AvatarPage() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar size="sm" fallback="JD" />
      <Avatar size="md" fallback="AB" />
      <Avatar size="lg" fallback="XY" />
      <Avatar size="md" />
    </div>
  )
}
