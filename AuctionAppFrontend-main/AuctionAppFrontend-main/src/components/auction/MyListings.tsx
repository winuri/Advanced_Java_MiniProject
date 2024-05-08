import Grid from "@cloudscape-design/components/grid";
import Spinner from "@cloudscape-design/components/spinner";
import useMyAuctions from "../../hooks/useMyAuctions"
import Auction from "./Auction";




const MyListings = () => {
  const fetchMyAuctionsQuery = useMyAuctions();

  if (fetchMyAuctionsQuery.isLoading) {
    return <Spinner size='large' />
  }

  if (fetchMyAuctionsQuery.isError) {
    return <p>Failed to fetch your auctions</p>
  }

  if (fetchMyAuctionsQuery.data?.length === 0) {
    return <p>No listings found</p>
  }

  return (
    <div>

      <p>Displaying a list of your created auctions:</p>
      <Grid
        gridDefinition={[
          { colspan: { default: 12, s: 4 } },
          { colspan: { default: 12, s: 4 } },
          { colspan: { default: 12, s: 4 } },
          { colspan: { default: 12, s: 4 } },
        ]}
      >
        {fetchMyAuctionsQuery.data?.map(auction => <Auction {...auction} />
        )}
      </Grid>
    </div>
  )
}

export default MyListings
