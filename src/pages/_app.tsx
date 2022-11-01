import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import { loggerLink, httpBatchLink } from '@trpc/client'
import SuperJSON from 'superjson'

export function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// todo add appRouter to generic
export default withTRPC({
  config({ctx}){

    const url = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
    : 'http://localhost:3000/api/trpc'

    const Links = [
      loggerLink(),
      httpBatchLink({
        url
      }),
    ]

  return {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 60
        },
      },
    },
    headers(){
      if (ctx?.req) {
        return {
          ...ctx.req.headers,
          'x-ssr': 1,
        }
      }
      return {}
    },
    links,
    transformer: SuperJSON
    }
  },
  ssr: false,
})(App)
