import React from 'react'
import { Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
// import { useSelector } from 'react-redux'
import Empty from 'components/Layout/Empty'
import style from './style.module.scss'

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

  const onCopy = () => {
    message.success('Address copied to clipboard')
  }

  return (
    <div>
      <div className="ray__heading">Wallet Addresses</div>
      {addresses && addresses.length < 1 && <Empty title="No addresses loaded" />}
      {addresses &&
        addresses.map((address, index) => {
          return (
            <div key={index} className={style.item}>
              <div className={style.icon}>
                <sup>/</sup>
                {index}
              </div>
              <div className={style.wrapper}>
                <CopyToClipboard text={address} onCopy={onCopy}>
                  <a className={`${style.address} mr-1`}>
                    <Tooltip title="Copy to clipboard">{address}</Tooltip>
                  </a>
                </CopyToClipboard>
                <a
                  href={`https://cardanoscan.io/address/${address}`}
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

export default WalletsAddresses
