import React from 'react'
import { Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AmountFormatter from 'components/AmountFormatter'
// import { useSelector } from 'react-redux'
import Empty from 'components/Empty'
import style from './style.module.scss'

const list = [
  {
    address:
      'addr1q856yfy7yfc7hv2p8prx4djyu7wmnj3v36ez8eexrupvyugzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqyax9sc',
    amount: 1827185.121512,
  },
  {
    address:
      'addr1q856yfy7yfc7hv2p8prx4djyu7wmnj3v36ez8eexrupvyugzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqyax9sc',
    amount: 188275.151212,
  },
  {
    address:
      'addr1q856yfy7yfc7hv2p8prx4djyu7wmnj3v36ez8eexrupvyugzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqyax9sc',
    amount: 87582.511212,
  },
]

const RewardsTopList = () => {
  // const wallet = useSelector((state) => state.wallets.wallet)

  const onCopy = () => {
    message.success('Address copied to clipboard')
  }

  return (
    <div>
      <div className="ray__heading">Most rewarded addresses</div>
      {list && list.length < 1 && <Empty title="No addresses loaded" />}
      {list &&
        list.map((address, index) => {
          return (
            <div key={index} className={style.item}>
              <div className={style.icon}>{index + 1}</div>
              <div className={style.wrapper}>
                <AmountFormatter amount={address.amount} ticker="RAY" prefix="+" />
                <CopyToClipboard text={address.address} onCopy={onCopy}>
                  <a className={`${style.address} mr-1`}>
                    <Tooltip title="Copy to clipboard">{address.address}</Tooltip>
                  </a>
                </CopyToClipboard>
                <a
                  href={`https://cardanoscan.io/address/${address.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ray__link"
                >
                  <Tooltip title="View on Cardanoscan">
                    <i className="fe fe-info" />
                  </Tooltip>
                </a>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default RewardsTopList
