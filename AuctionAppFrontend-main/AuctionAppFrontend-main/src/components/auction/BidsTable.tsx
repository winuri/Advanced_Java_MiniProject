import {
  Table,
  Box,
  SpaceBetween,
  Button,
  Header,
} from "@cloudscape-design/components"
import moment from "moment"
import { Link } from "react-router-dom";
import { Bid } from "../../hooks/useBids"

const BidsTable = (props: { data: Array<Bid>; isLoading: boolean }) => {
  return (
    <Table
      loading={props.isLoading}
      columnDefinitions={[
        {
          id: "placedBy",
          header: "Placed By",
          cell: (item) => <Link style={{ textDecoration: 'none' }} to={`/profile/${item.placedById}`}>{item.placedByUsername}</Link>,
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
      ]}
      resizableColumns
      sortingDisabled
      items={props.data}
      loadingText="Loading bids"
      empty={
        <Box textAlign="center" color="inherit">
          <SpaceBetween size={"s"}>
            <b>No bids yet, try placing one!</b>
          </SpaceBetween>
        </Box>
      }
      header={<Header>All Bids</Header>}
    />
  )
}

export default BidsTable
