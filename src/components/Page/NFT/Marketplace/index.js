import React from 'react'
import { Tooltip } from 'antd'
import _temp from './_temp'
import style from './style.module.scss'

const NFTMarketplace = () => {
  return (
    <div>
      <div className="ray__heading__nft">
        SpaceBudz Collection{' '}
        <span role="img" aria-label="">
          🔥
        </span>
      </div>
      <div className={style.category}>
        {_temp.spaceBudz.map((item, index) => (
          <div key={index} className={style.itemOuter}>
            <div className={style.item}>
              <div className="d-flex mb-3">
                <div className={style.itemCollection}>R</div>
                <div className={style.itemCollection}>
                  <i className="fe fe-user" />
                </div>
                <div className="ml-auto">
                  <i className="fe fe-more-horizontal" />
                </div>
              </div>
              <div className={style.itemImage}>
                <img src={`https://spacebudz.io/spacebudz/bud${item}.png`} alt="" />
              </div>
              <div className={style.itemTitle}>
                <strong>SpaceBud #{item}</strong>
              </div>
              <Tooltip title="Soon" placement="right">
                <a className={`${style.itemLink} ray__link`}>Place Bid</a>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      <div className="ray__heading__nft">Rarible Collection</div>
      <div className={style.category}>
        {_temp.topSellers.map((item, index) => (
          <div key={index} className={style.itemOuter}>
            <div className={style.item}>
              <div className="d-flex mb-3">
                <div className={style.itemCollection}>R</div>
                <div className={style.itemCollection}>
                  <i className="fe fe-user" />
                </div>
                <div className="ml-auto">
                  <i className="fe fe-more-horizontal" />
                </div>
              </div>
              <div className={style.itemImage}>
                <img src={`/resources/nft/${item.src}`} alt="" />
              </div>
              <div className={style.itemTitle}>
                <strong>{item.name}</strong>
              </div>
              <Tooltip title="Soon" placement="right">
                <a className={`${style.itemLink} ray__link`}>Place Bid</a>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NFTMarketplace
