import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    const [checked, setChecked] = React.useState(props.checked || false)

    React.useEffect(() => {
      setChecked(props.checked || false)
    }, [props.checked])

    return (
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          {...props}
          onChange={(e) => {
            setChecked(e.target.checked)
            props.onChange?.(e)
          }}
        />
        <div
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
            checked && 'bg-blue-600 border-blue-600',
            className
          )}
          onClick={() => {
            const event = { target: { checked: !checked } } as any
            setChecked(!checked)
            props.onChange?.(event)
          }}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }