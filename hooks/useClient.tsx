import { useApolloClient } from "@apollo/react-hooks"
import { DocumentNode } from "graphql"

const useClient = () => {
  const client = useApolloClient()

  const query = (QUERY: DocumentNode, { variables, ...opts }: any = {}) => {
    if (!opts.fetchPolicy) {
      // opts.fetchPolicy = 'no-cache'
    }
    return client.query({
      query: QUERY,
      variables,
      ...opts
    })
  }

  const mutate = (MUTATION: DocumentNode, { variables, ...opts }: any = {}) => {

    return client.mutate({
      mutation: MUTATION,
      variables,
      ...opts,
      fetchPolicy: 'no-cache',
    })
  }

  return { query, mutate }
}

export default useClient
