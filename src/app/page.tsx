'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ModeToggle } from '@/components/theme-toggle'
import { RadioGroupDemo } from './RadioForm'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SliderDemo } from './SliderDemo'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'

type DataType = 'uint8' | 'uint16' | 'hex8' | 'hex16'
const DataTypes: DataType[] = ['uint8', 'uint16', 'hex8', 'hex16']

const formSchema = z.object({
  array_length: z.coerce
    .number({
      invalid_type_error: 'Array length must be a number',
    })
    .min(1)
    .max(1024),
  hex_size: z.coerce
    .number({
      invalid_type_error: 'Hex size must be a number',
    })
    .min(1)
    .max(10),
  data_type: z.enum(['uint8', 'uint16', 'hex8', 'hex16']),
})

export function ProfileForm({ setData }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      array_length: 10,
      hex_size: 8,
      data_type: 'uint8',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    const res = await fetch('/api/', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    console.log(res)
    const data = await res.json()
    console.log(data)
    let stringified_data = JSON.stringify(data)
    stringified_data = stringified_data.replace(/,/g, ',\n')
    setData(stringified_data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="array_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Array Length:</FormLabel>
              <FormControl>
                <Input placeholder="min 1, max 1024" {...field} />
              </FormControl>
              <FormDescription>
                Number of elements to generate. Min 1, Max 1024.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hex_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hex Size:</FormLabel>
              <FormControl>
                <Input placeholder="min 1, max 10" {...field} />
              </FormControl>
              <FormDescription>
                Number of hex characters to in each element. Min 1, Max 10.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Data Type:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {DataTypes.map((type) => (
                    <FormItem
                      key={type}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="font-normal">{type}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Generate</Button>
      </form>
    </Form>
  )
}

export default function Home() {
  const [data, setData] = useState('')
  return (
    <div className="max-h-screen">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <main className="flex min-h-screen items-center justify-between p-24 gap-10">
        <div className="flex flex-col w-full gap-1.5">
          <Label htmlFor="generated-numbers">Your Generated Numbers</Label>
          <Textarea
            className="w-full min-h-[20rem] max-h-max"
            value={data}
            placeholder="Your generated numbers will be here."
            id="generated-numbers"
          />
        </div>
        <ProfileForm setData={setData} />
      </main>
    </div>
  )
}
