import { readFileSync } from "fs";

export const imageFileToBase64DataUrl = (filename: string) => {
  const contents = readFileSync(filename)
  const b64 = contents.toString('base64')
  const type = 'image/png'

  return `data:${type};base64,${b64}`
}
