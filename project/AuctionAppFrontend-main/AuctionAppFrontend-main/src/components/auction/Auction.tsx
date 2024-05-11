import React from "react"
import Header from "@cloudscape-design/components/header"
import style from "../../styles/AuctionListings.module.scss"
import AuctionItem, { Item } from "./AuctionItem"
import { useNavigate } from "react-router-dom"


const Auction = (props: Auction) => {
  const navigate = useNavigate()
  const handleClickAuction = (auctionId: string) => {
    navigate(`/auction/${auctionId}`)
  }

  return (
    <div
      className={`${style.auctionCard} ${props.closed ? style.closedAuction : ""}`}
      onClick={() => handleClickAuction(props.id)}
    >
      <div style={{ padding: "1rem" }}>
        {props.closed &&
          <div className={style.ribbon + " " + style.ribbonTopLeft}>
            <span>
              {"        "}Closed
            </span>
          </div>
        }
        <div className={style.auctionCardHeader}>
          <img
            className={style.auctionCardImage}
            src={props.s3ImageURL || "/images/No-Image-Placeholder.svg"}
          />

          <b>{props.name}</b>
        </div>

        <p>{props.description}</p>

        <div>
          <AuctionItem {...props.item} />
          <div className={style.currentHighestBid}>
            Highest Bid:{" "}
            <b className="price">
              {props?.currentHighestBid?.amount
                ? `$${props?.currentHighestBid?.amount}`
                : "No bids yet"}
            </b>
          </div>
          <div className={style.closingDateText}>
            {props.closed ?
              <b>Auction is closed</b> : `Closes ${props.closingTime}`
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auction
