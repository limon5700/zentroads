import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#ffffff" />
        <title>ZentroAds</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 