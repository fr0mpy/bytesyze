import { Select } from '@bytesyze-ui/core/select'

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
]

const frameworkOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'preact', label: 'Preact' },
]

export default function SelectPage() {
  return (
    <div className="flex flex-row gap-4 w-full">
      <Select
        triggerMode="click"
        options={fruitOptions}
        placeholder="Click to open"
      />
      <Select
        triggerMode="click"
        searchable
        options={frameworkOptions}
        placeholder="Click (searchable)"
      />
      <Select
        triggerMode="hover"
        options={fruitOptions}
        placeholder="Hover to open"
      />
      <Select
        triggerMode="hover"
        searchable
        options={frameworkOptions}
        placeholder="Hover (searchable)"
      />
    </div>
  )
}
