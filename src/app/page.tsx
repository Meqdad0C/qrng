import { ModeToggle } from '@/components/theme-toggle'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'
import Image from 'next/image'

type DataType = 'uint8' | 'uint16' | 'hex16'
const ArrayLength = {
  minimum: 1,
  maximum: 1024,
}

import { cn } from '@/lib/utils'
import { RadioGroupDemo } from './RadioForm'



import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { SliderDemo } from './SliderDemo'

export function TextareaWithLabel() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ModeToggle />
      <SliderDemo sliderName="Array Length" />
      <SliderDemo sliderName="Hexadecimal Size" />
      <RadioGroupDemo />
      <TextareaWithLabel />
      <Button>Generate</Button>
    </main>
  )
}
