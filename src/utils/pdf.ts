const escapePdfText = (value: string) =>
  value
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')

const splitIntoLines = (text: string, maxChars = 92) => {
  const normalized = text.replace(/\r\n/g, '\n')
  const rawLines = normalized.split('\n')
  const lines: string[] = []

  for (const rawLine of rawLines) {
    const line = rawLine.trimEnd()
    if (!line) {
      lines.push('')
      continue
    }

    const words = line.split(/\s+/)
    let current = ''

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (candidate.length <= maxChars) {
        current = candidate
      } else {
        if (current) {
          lines.push(current)
        }

        if (word.length > maxChars) {
          for (let index = 0; index < word.length; index += maxChars) {
            lines.push(word.slice(index, index + maxChars))
          }
          current = ''
        } else {
          current = word
        }
      }
    }

    if (current) {
      lines.push(current)
    }
  }

  return lines
}

const buildPageStream = (lines: string[]) => {
  const left = 48
  const top = 790
  const lineHeight = 16
  const content: string[] = ['BT', '/F1 11 Tf']

  lines.forEach((line, index) => {
    const y = top - index * lineHeight
    content.push(`1 0 0 1 ${left} ${y} Tm (${escapePdfText(line)}) Tj`)
  })

  content.push('ET')
  return content.join('\n')
}

export const downloadTextAsPdf = (filename: string, title: string, text: string) => {
  const allLines = splitIntoLines(`${title}\n\n${text}`)
  const linesPerPage = 44
  const pages: string[][] = []

  for (let index = 0; index < allLines.length; index += linesPerPage) {
    pages.push(allLines.slice(index, index + linesPerPage))
  }

  if (!pages.length) {
    pages.push([title])
  }

  const objects: string[] = []
  objects.push('<< /Type /Catalog /Pages 2 0 R >>')

  const pageObjectIds: number[] = []
  const contentObjectIds: number[] = []

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const pageObjectId = 3 + pageIndex * 2
    const contentObjectId = pageObjectId + 1
    pageObjectIds.push(pageObjectId)
    contentObjectIds.push(contentObjectId)
  }

  objects.push(
    `<< /Type /Pages /Count ${pages.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] >>`
  )

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectId = pageObjectIds[pageIndex]
    const contentObjectId = contentObjectIds[pageIndex]
    const stream = buildPageStream(pageLines)

    objects[pageObjectId - 1] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${contentObjectIds[contentObjectIds.length - 1] + 1} 0 R >> >> /Contents ${contentObjectId} 0 R >>`
    objects[contentObjectId - 1] =
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  })

  const fontObjectId = contentObjectIds[contentObjectIds.length - 1] + 1
  objects[fontObjectId - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'

  const parts: string[] = ['%PDF-1.4']
  const offsets: number[] = [0]

  objects.forEach((object, index) => {
    offsets.push(parts.join('\n').length + 1)
    parts.push(`${index + 1} 0 obj\n${object}\nendobj`)
  })

  const xrefOffset = parts.join('\n').length + 1
  parts.push(`xref\n0 ${objects.length + 1}`)
  parts.push('0000000000 65535 f ')

  for (let index = 1; index <= objects.length; index += 1) {
    parts.push(`${String(offsets[index]).padStart(10, '0')} 00000 n `)
  }

  parts.push(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  )

  const pdfContent = parts.join('\n')
  const blob = new Blob([pdfContent], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default downloadTextAsPdf
