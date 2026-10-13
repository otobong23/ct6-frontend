import { Logo } from '@/components/Logo'
import { coins } from '@/lib/coins'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Portfolios() {
  return (
    <div className='dashboard-shell'>
      <div className="section-header my-8!">
        <h1 className="header-logo">
          <Logo width={40} />
        </h1>
        <Link href={"/home"} className="pill">
          <Icon icon="heroicons-outline:arrow-narrow-left" width="14" /> Back
        </Link>
      </div>

      <div className="coin-list">
        {coins.map((coin, i) => (
          <div className="coin-row" key={i}>
            <span
              className="coin-icon"
            >
              <Image src={coin.icon} alt={coin.name} width={30} />
            </span>
            <div className="coin-info">
              <p className="coin-name">{coin.name}</p>
              <p className="coin-symbol">{coin.symbol}</p>
            </div>
            <div className="coin-value">
              <p className="coin-price">{coin.price}</p>
              {coin.addFunds ? (
                <p className="add-funds-link">+Add Funds</p>
              ) : (
                <p className="coin-change">{coin.change}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
