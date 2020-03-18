import superagent from 'superagent'
import {
  TextField, Button, InputLabel,
  FormHelperText, Input, FormControl
} from '@material-ui/core'
import { useState, FormEvent, useEffect } from 'react'
import useUser from 'hooks/useUser'
import Router from 'next/router'

const SignIn = ({ user }) => {

  const [data, setData] = useState({
    username: '',
    password: ''
  })

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault()
    superagent
      .post('/signin')
      .send(data)
      .then(() => {
        window.location.reload()
      })
  }

  const onChange = (evt: any) => {
    const { target: { name, value } } = evt
    setData({
      ...data,
      [name]: value
    })
  }

  useEffect(() => {
    if (user) {
      Router.push('/')
    }
  })
  if (user) {
    return null
  }

  return (
    <form onSubmit={onSubmit} noValidate autoComplete="off">

      <FormControl>
        <InputLabel htmlFor="my-input">Username</InputLabel>
        <Input
          onChange={onChange}
          value={data.username}
          name="username"
        />
      </FormControl>

      <FormControl>
        <InputLabel htmlFor="my-input">Password</InputLabel>
        <Input
          name="password"
          value={data.password}
          onChange={onChange} type="password"
        />
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        Sign In
      </Button>

    </form>
  )
}

export default SignIn
