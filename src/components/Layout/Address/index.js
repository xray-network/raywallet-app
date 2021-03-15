import React from 'react'
import { Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Address = ({ address, prefix, cut = false }) => {
  const onCopy = () => {
    message.success('Copied to clipboard')
  }

  return (
    <span className="ray__address">
      <CopyToClipboard text={address} onCopy={onCopy}>
        <Tooltip title="Copy to Clipboard">
          {prefix && <span className="mr-2">{prefix}</span>}
          {!cut && <a>{address}</a>}
          {cut && (
            <a>
              {address.slice(0, 8)}...{address.slice(-16)}
            </a>
          )}
        </Tooltip>
      </CopyToClipboard>
    </span>
  )
}

export default Address
