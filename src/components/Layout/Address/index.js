import React from 'react'
import { Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Address = ({ address, prefix, cut = false }) => {
  const onCopy = () => {
    message.success('Copied to clipboard')
  }

  return (
    <CopyToClipboard text={address} onCopy={onCopy}>
      <Tooltip title="Copy to Clipboard">
        <span className="ray__address">
          {prefix && <span className="mr-2">{prefix}</span>}
          {!cut && <a className="ray__address">{address}</a>}
          {cut && (
            <a className="ray__address">
              {address.slice(0, 8)}...{address.slice(-8)}
            </a>
          )}
        </span>
      </Tooltip>
    </CopyToClipboard>
  )
}

export default Address
