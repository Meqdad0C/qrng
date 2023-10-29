'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ModeToggle } from '@/components/theme-toggle'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

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

function ProfileForm({ setData }: SetDataProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      array_length: 10,
      hex_size: 8,
      data_type: 'uint8',
    },
  })

  const RadioDescription = ({ type }: { type: string }) => {
    switch (type) {
      case 'uint8':
        return <FormDescription>Range of 0 to 255.</FormDescription>
      case 'uint16':
        return <FormDescription>Range of 0 to 65535.</FormDescription>
      case 'hex8':
        return (
          <FormDescription>
            Range of 0x00 to 0xff, for Size of 1.
          </FormDescription>
        )
      case 'hex16':
        return (
          <FormDescription>
            Range of 0x0000 to 0xffff. for Size of 1.
          </FormDescription>
        )
      default:
        return <FormDescription></FormDescription>
    }
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)
    const res = await fetch('/api/', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    // console.log(res)
    const data = await res.json()
    // console.log(data)
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
                      <RadioDescription type={type} />
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

const WichmannHillSchema = z.object({
  seed: z.coerce.number(),
  array_length: z.coerce.number(),
})

type SetDataProps = {
  setData: React.Dispatch<React.SetStateAction<string>>
}

const ClassicalForm = ({ setData }: SetDataProps) => {
  const form = useForm<z.infer<typeof WichmannHillSchema>>({
    resolver: zodResolver(WichmannHillSchema),
    defaultValues: {
      seed: 457428938475,
      array_length: 10,
    },
  })
  let rnd_state = [0, 0, 0]
  const seed = (initial_seed: number) => {
    const x = initial_seed % 30268
    initial_seed = (initial_seed - x) / 30268
    const y = initial_seed % 30306
    initial_seed = (initial_seed - y) / 30306
    const z = initial_seed % 30322
    initial_seed = (initial_seed - z) / 30322

    rnd_state = [x + 1, y + 1, z + 1]
    // console.log('[seed]', rnd_state);
  }
  const random = () => {
    rnd_state[0] = (171 * rnd_state[0]) % 30269
    rnd_state[1] = (172 * rnd_state[1]) % 30307
    rnd_state[2] = (170 * rnd_state[2]) % 30323
    return (
      (rnd_state[0] / 30269 + rnd_state[1] / 30307 + rnd_state[2] / 30323) % 1
    )
  }

  async function onSubmit(values: z.infer<typeof WichmannHillSchema>) {
    // console.log(values)
    seed(values.seed)
    const data = []
    for (let i = 0; i < values.array_length; i++) {
      data.push(random())
    }
    // console.log(data)
    let stringified_data = JSON.stringify(data)
    stringified_data = stringified_data.replace(/,/g, ',\n')
    setData(stringified_data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="seed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seed:</FormLabel>
              <FormControl>
                <Input placeholder="example: 457428938475" {...field} />
              </FormControl>
              <FormDescription>
                Seed for the random number generator.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="array_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Array Length:</FormLabel>
              <FormControl>
                <Input placeholder="example: 10" {...field} />
              </FormControl>
              <FormDescription>Number of elements to generate.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit">Generate</Button>
          <Link href={'https://meqdad0c.github.io/qrng/analysis.html'}>Go to Algorithm Analysis</Link>
        </div>
      </form>
    </Form>
  )
}

export default function Home() {
  const [data, setData] = useState('')
  return (
    <div>
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <main className="flex min-h-screen items-center justify-between p-24 gap-10">
        <div className="flex flex-col w-full gap-1.5">
          <Label htmlFor="generated-numbers" className="text-xl">
            Generated Numbers
          </Label>
          <Textarea
            className="w-full min-h-[20rem] max-h-max"
            value={data}
            placeholder="Your generated numbers will be here."
            id="generated-numbers"
          />
        </div>
        <div className="flex flex-col">
          <Tabs defaultValue="quantum" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="quantum">Quantum RNG</TabsTrigger>
              <TabsTrigger value="classic">Classical RNG</TabsTrigger>
            </TabsList>
            <TabsContent value="quantum">
              Generated in real-time in ANU lab by measuring the quantum
              fluctuations of the vacuum.
              <Card className="p-4">
                <ProfileForm setData={setData} />
              </Card>
            </TabsContent>
            <TabsContent value="classic">
              The Wichmann-Hill Random Number Algorithm
              <Card className="p-4">
                <ClassicalForm setData={setData} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
