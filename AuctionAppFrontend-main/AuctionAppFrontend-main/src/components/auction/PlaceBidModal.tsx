import {
  Modal,
  Box,
  SpaceBetween,
  Button,
  FormField,
  Input,
  Spinner,
} from "@cloudscape-design/components"
import { forOwn } from "lodash"
import React, { useContext, useState } from "react"
import { Form } from "react-router-dom"
import { z } from "zod"
import { FlashbarContext } from "../../App"
import { FlashbarNotificationId } from "../../constants/notifications"
import useCreateBid from "../../hooks/useCreateBid"
import { FlashBarNotificationActionType } from "../../reducers/flashBarNotificationReducer"

interface PlaceBidModalProps {
  setShowPlaceBidModal: React.Dispatch<React.SetStateAction<boolean>>
  showPlaceBidModal: boolean
  auctionId: string
  refetchBidsData: Function
}

const placeBidRequestSchema = z.object({
  amount: z.preprocess((arg) => Number(arg), z.number().min(1)),
  comment: z.string().min(0).max(100),
})

const PlaceBidModal = (props: PlaceBidModalProps) => {
  const [amount, setAmount] = useState("1.0")
  const [comment, setComment] = useState("")
  const [errors, setErrors] = useState({
    amount: "",
    comment: "",
  })
  const { dispatchFlashBarNotifications } = useContext(FlashbarContext);

  const handleMutationSuccess = () => {
    props.refetchBidsData()

    dispatchFlashBarNotifications({
      type: FlashBarNotificationActionType.ADD,
      notification: {
        header: "Placed bid",
        type: "success",
        content:
          `You have successfully placed a bid for $${amount}!`,
        id: FlashbarNotificationId.PLACED_BID_NOTIFICATION,
        onDismiss: () => dispatchFlashBarNotifications({
          type: FlashBarNotificationActionType.REMOVE,
          notification: {
            id: FlashbarNotificationId.PLACED_BID_NOTIFICATION,
          }
        })
      }
    })
  }

  const handleMutate = () => {
    dispatchFlashBarNotifications({
      type: FlashBarNotificationActionType.ADD,
      notification: {
        header: "Placing bid...",
        type: "info",
        content: <Spinner />,
        dismissLabel: "Dismiss message",
        id: FlashbarNotificationId.PLACED_BID_NOTIFICATION,
        onDismiss: () => dispatchFlashBarNotifications({
          type: FlashBarNotificationActionType.REMOVE,
          notification: {
            id: FlashbarNotificationId.PLACED_BID_NOTIFICATION,
          }
        })
      }
    })
  }



  const createBidMutation = useCreateBid({
    handleSuccess: handleMutationSuccess,
    handleMutate: handleMutate,
  })

  const clearErrorForId = (id: string) => {
    setErrors((prevErrors) => {
      return {
        ...prevErrors,
        [id]: "",
      }
    })
  }

  const handleClickSubmit = () => {
    const placeBidRequest = {
      amount: amount,
      comment: comment,
    }
    const placeBidRequestValidation =
      placeBidRequestSchema.safeParse(placeBidRequest)

    if (placeBidRequestValidation.success) {
      createBidMutation.mutate({
        auctionId: props.auctionId,
        ...placeBidRequestValidation.data,
      })
      props.setShowPlaceBidModal(false)
      return
    }

    const errors = placeBidRequestValidation.error.flatten()
    const fieldErrors = errors.fieldErrors
    forOwn(fieldErrors, (value, key) => {
      setErrors((prevErrors) => {
        return {
          ...prevErrors,
          [key]: value,
        }
      })
    })
  }

  return (
    <Modal
      onDismiss={() => props.setShowPlaceBidModal(false)}
      visible={props.showPlaceBidModal}
      closeAriaLabel="Close modal"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              onClick={() => props.setShowPlaceBidModal(false)}
              variant="link"
            >
              Cancel
            </Button>
            <Button onClick={() => handleClickSubmit()} variant="primary">
              Ok
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Place Bid"
    >
      <SpaceBetween size={"xl"}>
        <div>Fill in the details below to place a bid!</div>
        <Form>
          <FormField errorText={errors.amount} label="Amount">
            <Input
              value={amount}
              onChange={(e) => {
                clearErrorForId("amount")
                setAmount(e.detail.value)
              }}
            />
          </FormField>
          <FormField
            label="Comment"
            description="Optionally add a comment with bid"
            errorText={errors.comment}
          >
            <Input
              value={comment}
              onChange={(e) => {
                clearErrorForId("comment")
                setComment(e.detail.value)
              }}
              placeholder={"I would really like to buy this..."}
            />
          </FormField>
        </Form>
      </SpaceBetween>
    </Modal>
  )
}

export default PlaceBidModal
