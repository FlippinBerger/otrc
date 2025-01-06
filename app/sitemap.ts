import { MetadataRoute } from 'next'

type Change =
  | 'daily'
  | 'always'
  | 'hourly'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'
  | undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages = [
    {
      url: 'https://otrcfc.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as Change,
      priority: 1,
    },
    {
      url: 'https://otrcfc.com/faq',
      lastModified: new Date(),
      changeFrequency: 'daily' as Change,
      priority: 0.9,
    },
  ]

  const sitemap = [...defaultPages]

  return sitemap
}
