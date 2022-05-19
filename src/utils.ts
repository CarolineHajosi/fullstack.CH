function fixUrl(url: string): string {
  if (import.meta.env.MODE === 'development') {
    console.log('DEV MODE')
    return 'http://localhost:1188' + url
  } else {
    console.log('PRODUCTION MODE')
    return url
  }
}

export { fixUrl }
