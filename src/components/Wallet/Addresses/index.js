import React from 'react'
// import { useSelector } from 'react-redux'
import Address from 'components/Layout/Address'
import Empty from 'components/Layout/Empty'

const addresses = [
  'addr1q856yfy7yfc7hv2p8prx4djyu7wmnj3v36ez8eexrupvyugzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqyax9sc',
  'addr1q9mnyfthe60zztues86x2halq8ngjpwjmwq5s4ec9uy458szyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqf2n58t',
  'addr1q9f5vt678heeurvayayt82wqt9xzcs360t3ktxqvhtq9s0szyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqh8e66e',
  'addr1qx88t9jr0pfnpyjh4z6ewd9uxhtvagele6p38d90tzrnf2gzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kq8gycvl',
  'addr1qx8kvkqx2tug8ajy63z5qfn7q35xm864mwxffkrd02ahrtqzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqldcpj4',
  'addr1q856yfy7yfc7hv2p8prx4djyu7wmnj3v36ez8eexrupvyugzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqyax9sc',
  'addr1q9mnyfthe60zztues86x2halq8ngjpwjmwq5s4ec9uy458szyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqf2n58t',
  'addr1q9f5vt678heeurvayayt82wqt9xzcs360t3ktxqvhtq9s0szyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqh8e66e',
  'addr1qx88t9jr0pfnpyjh4z6ewd9uxhtvagele6p38d90tzrnf2gzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kq8gycvl',
  'addr1qx8kvkqx2tug8ajy63z5qfn7q35xm864mwxffkrd02ahrtqzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqldcpj4',
  'addr1q856yfy7yfc7hv2p8prx4djyu7wmnj3v36ez8eexrupvyugzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqyax9sc',
  'addr1q9mnyfthe60zztues86x2halq8ngjpwjmwq5s4ec9uy458szyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqf2n58t',
  'addr1q9f5vt678heeurvayayt82wqt9xzcs360t3ktxqvhtq9s0szyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqh8e66e',
  'addr1qx88t9jr0pfnpyjh4z6ewd9uxhtvagele6p38d90tzrnf2gzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kq8gycvl',
  'addr1qx8kvkqx2tug8ajy63z5qfn7q35xm864mwxffkrd02ahrtqzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqldcpj4',
  'addr1q856yfy7yfc7hv2p8prx4djyu7wmnj3v36ez8eexrupvyugzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqyax9sc',
  'addr1q9mnyfthe60zztues86x2halq8ngjpwjmwq5s4ec9uy458szyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqf2n58t',
  'addr1q9f5vt678heeurvayayt82wqt9xzcs360t3ktxqvhtq9s0szyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqh8e66e',
  'addr1qx88t9jr0pfnpyjh4z6ewd9uxhtvagele6p38d90tzrnf2gzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kq8gycvl',
  'addr1qx8kvkqx2tug8ajy63z5qfn7q35xm864mwxffkrd02ahrtqzyu8ye3d6u3f30g2mn2r02rjkc9uzsz3et2ykhvgjy0kqldcpj4',
]

const WalletsAddresses = () => {
  // const wallet = useSelector((state) => state.wallets.wallet)

  return (
    <div>
      <div className="ray__heading">Wallet Addresses</div>
      {addresses && addresses.length < 1 && <Empty title="No addresses loaded" />}
      {addresses &&
        addresses.map((address, index) => {
          return (
            <div key={index} className="d-flex mb-4">
              <div className="ray__item__path mr-3">
                <sup>/</sup>
                {index}
              </div>
              <div>
                <Address address={address} />
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default WalletsAddresses
