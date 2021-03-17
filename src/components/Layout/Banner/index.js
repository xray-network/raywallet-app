import React, { useState } from 'react'
import { Statistic } from 'antd'

const Banner = () => {
  const [date] = useState(new Date("2021-04-01"))

  return (
    <div className="ray__banner">
      RAY Wallet is under development. The release date is 1 Apr 2021. Time to release{' '}
      <Statistic.Countdown
        className="ray__count__inline"
        value={date}
        format="D[d] HH[h] mm[m] ss[s]"
      />
    </div>
  )
}

export default Banner
