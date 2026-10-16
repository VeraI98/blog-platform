export function formErrors(error) {
  if (error instanceof Error)
    return { general: [error.message || 'Network error. Please try again.'] }
  if (error && typeof error === 'object' && Object.keys(error).length) return error
  return { general: ['Something went wrong. Please try again.'] }
}
