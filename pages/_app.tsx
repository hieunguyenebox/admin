import withApollo from 'components/wtihApollo'
import useUser from 'hooks/useUser'
import { useEffect } from 'react'
import Router from 'next/router'

function MyApp({ Component, pageProps }: any) {

  const { loading, user } = useUser()

  useEffect(() => {
    if (!user && !loading) {
      Router.push('/signin')
    }
  }, [loading])

  if (loading) return 'loading...'

  console.log(Router.pathname)
  if (!user && Router.pathname !== '/signin') return null

  return (
    <>
      <Component user={user} {...pageProps} />
    </>
  )
}

export default withApollo(MyApp)
