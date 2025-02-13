const setImageUrlFromBlob = (blob: Blob) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) resolve(reader.result as string)
    }
    reader.onerror = () => ''
    reader.readAsDataURL(blob)
  })
}

export default setImageUrlFromBlob
