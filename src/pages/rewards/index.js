import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux'
import Empty from 'components/Empty'

const Rewards = () => {
  const dispatch = useDispatch()
  const wallet = useSelector((state) => state.wallets.wallet)

  useEffect(() => {
    if (wallet.selected) {
      dispatch({
        type: 'wallets/FETCH_WALLET_DATA',
        payload: {
          walletId: wallet.selected,
        },
      })
    }
  }, [wallet.selected, dispatch])

  return (
    <div>
      <Helmet title="Rewards" />
      <Empty title="Pools are not available at the moment" />
    </div>
  )
}

export default Rewards
