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

type DataType = 'uint8' | 'uint16' | 'hex16'
const DataTypes: DataType[] = ['uint8', 'uint16', 'hex16']

export function TextareaWithLabel() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  )
}

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
    .max(1024),
  data_type: z.enum(['uint8', 'uint16', 'hex16']),
})

export function ProfileForm() {
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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                Enter number of elements to generate. Min 1, Max 1024.
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
                <Input placeholder="min 1, max 1024" {...field} />
              </FormControl>
              <FormDescription>
                Number of hex characters to in each element. Min 1, Max 1024.
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
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ProfileForm />
      <ModeToggle />
      <TextareaWithLabel />
    </main>
  )
}
