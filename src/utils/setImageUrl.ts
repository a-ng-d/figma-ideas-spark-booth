const setImageUrl = (uint8Array: Uint8Array | null | undefined) => {
  if (uint8Array !== null && uint8Array !== undefined) {
    const blob = new Blob([uint8Array], {
      type: 'image/png',
    })

    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) resolve(reader.result as string)
      }
      reader.onerror = () => ''
      reader.readAsDataURL(blob)
    })
  } else return undefined
}

export default setImageUrl
