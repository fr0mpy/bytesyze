'use client'

import { Search } from 'lucide-react'
import { Input } from './input'

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'disabled'> {
  disabled?: boolean
  ref?: React.Ref<HTMLInputElement>
}

function SearchInput({ className, ref, ...props }: SearchInputProps) {
  return (
    <Input
      type="search"
      leftIcon={<Search className="h-4 w-4" />}
      className={className}
      ref={ref}
      {...props}
    />
  )
}

export { SearchInput }
export type { SearchInputProps }
