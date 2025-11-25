// src/fields/seo.ts
import type { Field } from 'payload'

export const SEOFields: Field[] = [
  {
    name: 'seo',
    type: 'group',
    label: 'SEO & Metadata',
    fields: [
      {
        name: 'metaTitle',
        type: 'text',
        label: 'Meta Title',
      },
      {
        name: 'metaDescription',
        type: 'textarea',
        label: 'Meta Description',
      },
      {
        name: 'openGraphImage',
        type: 'upload',
        relationTo: 'sermons',
        label: 'Open Graph Image',
      },
      {
        name: 'canonicalURL',
        type: 'text',
        label: 'Canonical URL',
      },
    ],
  },
]
