import React from 'react'
import { useRouteError } from 'react-router'

function ErrorBoundary() {
  const err = useRouteError()
  console.error(err)
  if (err.response) return (
    <div>Error{err.response.status ? ` ${err.response.status}` : ""}{err.response.data.msg ? ` | ${err.response.data.msg}` : ""}</div>
  )
}

export default ErrorBoundary
