import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import { QUERY_ME } from '../graphql_queries/Me'

const useUser = () => {

  const { data, loading, error } = useQuery(QUERY_ME, {
    ssr: false
  })

  // if (error) {
  //   const unauthorized = _.get(error, 'graphQLErrors[0].statusCode') === 401
  //   if (unauthorized) {
  //     return { user: null }
  //   }

  //   return { error }
  // }

  return {
    user: data ? data.me : null,
    loading,
    error
  }
}

export default useUser
