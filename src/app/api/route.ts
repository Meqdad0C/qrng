import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const API_KEY = process.env.QAPI_KEY
  const API_URL = process.env.QAPI_URL
  if (!API_KEY || !API_URL) {
    return NextResponse.error()
  }
  const { array_length, data_type, hex_size } = body
  console.log(body, API_KEY, API_URL)
  console.log(array_length, data_type, hex_size)

  const url = `${API_URL}?length=${array_length}&type=${data_type}&size=${hex_size}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
    },
  })
  const { data } = await response.json()
  console.log(data)

  return NextResponse.json(data)
}
