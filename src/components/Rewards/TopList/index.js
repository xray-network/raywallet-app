import React from 'react'
import Address from 'components/Layout/Address'
import AmountFormatter from 'components/Layout/AmountFormatter'
// import { useSelector } from 'react-redux'
import Empty from 'components/Layout/Empty'

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

  return (
    <div>
      <div className="ray__heading">Most Rewarded Addresses</div>
      {list && list.length < 1 && <Empty title="No addresses loaded" />}
      {list &&
        list.map((address, index) => {
          return (
            <div>
              <div key={index} className="d-flex mb-4">
                <div className="ray__item__number mr-3">{index + 1}</div>
                <div>
                  <AmountFormatter amount={address.amount} ticker="RAY" prefix="+" />
                  <Address address={address.address} />
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default RewardsTopList
