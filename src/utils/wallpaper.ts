const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export async function readWallpaper(file: File): Promise<string> {
  if (
    !['image/jpeg', 'image/png', 'image/webp', 'image/bmp'].includes(file.type)
  ) {
    throw new Error('Please choose a JPG, PNG, WebP or BMP image.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('The background image must be smaller than 5 MiB.')
  }
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Unable to read the image.'))
    reader.readAsDataURL(file)
  })
  const image = new Image()
  image.src = data
  await image.decode()
  return data
}
