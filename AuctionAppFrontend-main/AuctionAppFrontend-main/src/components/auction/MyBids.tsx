import Box from "@cloudscape-design/components/box";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import moment from "moment";
import { Link } from "react-router-dom";
import useMyBids from "../../hooks/useMyBids";



const MyBids = () => {
  const fetchMyBidsQuery = useMyBids();

  console.log(fetchMyBidsQuery.data)
  return (
    <div>
      <p>Your bids:</p>
      <Table
        loading={fetchMyBidsQuery.isLoading}
        columnDefinitions={[
          {
            id: "auction",
            header: "Auction",
            cell: (item) => <Link to={`/auction/${item.auctionId}`}>{item.auctionName}</Link>
          },
          {
            id: "placedAt",
            header: "Placed At",
            cell: (item) => moment(item.placedAt).fromNow(),
          },
          {
            id: "comment",
            header: "Comment",
            cell: (item) => item.comment || "-",
          },
          {
            id: "amount",
            header: "Amount",
            cell: (item) => <b style={{ color: "green" }}>${item.amount}</b>,
          },
          {
            id: "highestAmount",
            header: "Highest Bid",
            cell: (item) => <b style={{ color: "darkgreen" }}>${item.auctionCurrentHighestBidAmount}</b>
          },
          {
            id: "auctionCloses",
            header: "Auction Closes in",
            cell: (item) => moment(item.auctionClosingTime).isBefore(moment()) ?
              <b style={{ color: "firebrick" }}>Closed</b>
              : moment(item.auctionClosingTime).fromNow(),
          }
        ]}
        resizableColumns
        sortingDisabled
        items={fetchMyBidsQuery.data!}
        loadingText="Loading bids"
        empty={
          <Box textAlign="center" color="inherit">
            <SpaceBetween size={"s"}>
              <b>You haven't placed any bids yet</b>
            </SpaceBetween>
          </Box>
        }
        header={<Header>All Bids</Header>}
      />
    </div>
  )
}

export default MyBids;
