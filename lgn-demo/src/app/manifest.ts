import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LGN | Lisa Granger Network',
    short_name: 'LGN',
    description: 'Trinidad and Tobago’s New Home for Live Television, Local Stories, and Community Voice.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D051A',
    theme_color: '#2D0B68',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
