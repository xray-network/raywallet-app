import React from 'react'
import { Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Address = ({ address }) => {
  const onCopy = () => {
    message.success('Copied to clipboard')
  }

  return (
    <div className="ray__address">
      <CopyToClipboard text={address} onCopy={onCopy}>
        <Tooltip title="Copy to Clipboard">
          <a>{address}</a>
        </Tooltip>
      </CopyToClipboard>
    </div>
  )
}

export default Address
