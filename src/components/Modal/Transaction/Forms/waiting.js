import React, { useState, useEffect } from 'react'
import { Button, Result } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import Address from 'components/Layout/Address'

const WaitingForm = ({ handleCancel }) => {
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
      clearInterval(runner)
      refreshData()
    }
    // eslint-disable-next-line
  }, [transactionSuccess])

  return (
    <div className="text-center">
      {!transactionSuccess && (
        <Result
          icon={<LoadingOutlined style={{ fontSize: 72 }} spin />}
          title="Sending..."
          subTitle={
            <div>
              <div className="mb-3">This may take a while, please wait.</div>
              <Address prefix="Tx:" address={transactionWaitingHash} cut />
            </div>
          }
        />
      )}
      {transactionSuccess && (
        <Result
          status="success"
          title="Successfully Sent"
          subTitle={<Address prefix="Tx:" address={transactionWaitingHash} cut />}
          extra={[
            <Button onClick={handleCancel} size="large" key="close">
              Close
            </Button>,
          ]}
        />
      )}
    </div>
  )
}

export default WaitingForm
