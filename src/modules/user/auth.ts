
const requireAuth = (req: { user: any }, permission = '') => {
  const { user } = req
  if (!user) {
    throw new Error(JSON.stringify({
      message: 'unauthorized!',
      statusCode: 401
    }))
  }
  if (permission) {
    if (!req.user.permissions.includes(permission)) {
      throw new Error('Permission denied!')
    }
  }
}

export default requireAuth
