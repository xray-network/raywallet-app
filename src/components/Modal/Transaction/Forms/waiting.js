import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const WaitingForm = () => {
  const dispatch = useDispatch()
  const transactionWaitingHash = useSelector((state) => state.transactions.transactionWaitingHash)
  const transactionSuccess = useSelector((state) => state.transactions.transactionSuccess)
  const [runner, setRunner] = useState(null)

  const refreshData = () => {
    dispatch({
      type: 'wallets/FETCH_NETWORK_STATE',
    })
    dispatch({
      type: 'wallets/FETCH_WALLET_DATA',
    })
    dispatch({
      type: 'wallets/FETCH_SIDE_DATA',
    })
  }

  const checkTransaction = (hash) => {
    console.log('check_tx_hash', hash)
    dispatch({
      type: 'transactions/CHECK_TX',
      payload: {
        hash,
      },
    })
  }

  useEffect(() => {
    if (transactionWaitingHash) {
      const interval = setInterval(() => {
        checkTransaction(transactionWaitingHash)
      }, 5000)
      setRunner(interval)
    }
    // eslint-disable-next-line
  }, [transactionWaitingHash])

  useEffect(() => {
    if (transactionSuccess) {
      console.log('tx_acccepted')
      clearInterval(runner)
      refreshData()
    }
    // eslint-disable-next-line
  }, [transactionSuccess])

  return (
    <div className="text-center">
      {!transactionSuccess && 'waiting'}
      {transactionSuccess && 'success'}
    </div>
  )
}

export default WaitingForm
