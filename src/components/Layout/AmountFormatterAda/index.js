import React from 'react'

const AmountFormatter = ({ amount }) => {
  return <div>{`${amount.toString()} ADA`}</div>
}

export default AmountFormatter
