export function ensureUriSafeOrFallback (returnUri: string, safeReturnUri: string): string {
  if (!returnUri || !returnUri.startsWith('/')) {
    return safeReturnUri
  }

  return returnUri.match('^[a-zA-Z0-9_\/\-]*$') ? returnUri : safeReturnUri
}
