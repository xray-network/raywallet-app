import React from 'react'
import { Helmet } from 'react-helmet'
import Empty from 'components/Empty'

const KickStart = () => {
  return (
    <div>
      <Helmet title="KickStart" />
      <Empty title="Projects are not available at the moment" />
    </div>
  )
}

export default KickStart
