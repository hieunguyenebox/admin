import gql from "graphql-tag";

export const QUERY_ME = gql`
  {
    me {
      id
      name
    }
  }
`