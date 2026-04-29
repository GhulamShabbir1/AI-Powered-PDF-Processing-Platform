import apiClient from './apiClient'
import type { LanguageOption } from '../types/language.types'

const normalizeLanguage = (item: Record<string, unknown>): LanguageOption | null => {
  const code = item.code
  const name = item.name

  if (typeof code !== 'string' || typeof name !== 'string') {
    return null
  }

  return {
    code: code.trim(),
    name: name.trim(),
  }
}

const extractLanguages = (payload: unknown): LanguageOption[] => {
  if (!payload || typeof payload !== 'object') {
    return []
  }

  const data = payload as Record<string, unknown>
  const candidates = [
    data.languages,
    data.data,
    data.data && typeof data.data === 'object' ? (data.data as Record<string, unknown>).languages : null,
  ]

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue

    const languages = candidate
      .map((item) => (item && typeof item === 'object' ? normalizeLanguage(item as Record<string, unknown>) : null))
      .filter((item): item is LanguageOption => Boolean(item))

    if (languages.length) {
      return languages
    }
  }

  return []
}

export const languageService = {
  async getLanguages(): Promise<LanguageOption[]> {
    const response = await apiClient.get('/service/languages')
    return extractLanguages(response.data)
  },
}

export default languageService
