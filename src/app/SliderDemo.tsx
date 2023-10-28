'use client'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'

type SliderProps = React.ComponentProps<typeof Slider>
type SliderDemoProps = SliderProps & {
  sliderName: string
}

export function SliderDemo({
  className,
  sliderName,
  ...props
}: SliderDemoProps) {
  const [value, setValue] = useState(50)
  return (
    <>
      <Label htmlFor="slider">
        <p>
          {sliderName}: {value}
        </p>
      </Label>
      <Slider
        value={[value]}
        defaultValue={[50]}
        onValueChange={(eventValue) => {
          const newValue = eventValue[0]
          setValue(newValue)
        }}
        min={2}
        max={1024}
        step={2}
        className={cn('w-[60%]', className)}
        {...props}
      />
    </>
  )
}
