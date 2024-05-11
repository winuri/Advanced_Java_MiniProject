import Button from "@cloudscape-design/components/button"
import Container from "@cloudscape-design/components/container"
import Form from "@cloudscape-design/components/form"
import FormField from "@cloudscape-design/components/form-field"
import Header from "@cloudscape-design/components/header"
import Input from "@cloudscape-design/components/input"
import Select, { SelectProps } from "@cloudscape-design/components/select"
import SpaceBetween from "@cloudscape-design/components/space-between"
import Textarea from "@cloudscape-design/components/textarea"
import { forOwn, map } from "lodash"
import { useContext, useState } from "react"
import { useMutation } from "react-query"
import { AlertContext } from "../../App"
import { useNavigate } from "react-router-dom"
import { Auction, auctionSchema } from "../../schemas/auctionSchema"
import { Item, itemSchema } from "../../schemas/itemSchema"
import { createAuction } from "../../hooks/useCreateAuction"
import DatePicker from "@cloudscape-design/components/date-picker"
import moment from "moment"
import Avatar from "react-avatar-edit"
import { dataUrlToFile } from "../../utils/fileUtils"
import fetchAllCategories from "../../common/fetchAllCategories"

const MAX_ALLOWED_FILE_SIZE_IN_BYTES = 1000000
const IMAGE_NAME = "auctionItem"

const CreateListing = () => {
  const navigate = useNavigate()

  const [imageSource, setImageSource] = useState<{
    src: string
    preview: null | string
  }>({
    src: "",
    preview: null,
  })

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([])

  const [category, setSelectedCategory] =
    useState<SelectProps.Option | null>(null)

  const [showCategoryError, setShowCategoryError] = useState(false)

  // Auction info
  const [auctionInfo, setAuctionInfo] = useState({
    name: "",
    description: "",
    closingTime: "",
  })
  const [auctionInfoErrors, setAuctionInfoErrors] = useState({
    name: "",
    description: "",
    closingTime: "",
    selectedImage: "",
  })

  // Item info
  const [itemInfo, setItemInfo] = useState({
    name: "",
    description: "",
    startingPrice: "4.99",
  })
  const [itemInfoErrors, setItemInfoErrors] = useState({
    name: "",
    description: "",
    startingPrice: "",
  })

  const { setAlertNotification } = useContext(AlertContext)

  const createAuctionMutation = useMutation({
    mutationFn: (newAuction: {
      auction: Auction
      item: Item
      categoryId: string
      image?: File
    }) => {
      return createAuction(newAuction)
    },
    onError: (error, variables, context) => {
      console.error(`An error occurred ${error}`)
      setAlertNotification({
        isVisible: true,
        type: "error",
        header: "Error saving the listing",
        content: "Couldn't create an auction. Please try again later.",
      })
    },
    onSuccess: () => {
      setAlertNotification({
        type: "success",
        isVisible: true,
        header: "Successfull!",
        content: "You have listed an item",
      })
      setTimeout(() => {
        navigate("/")
      }, 1500)
    },
  })


  const handleLoadCategoryOptions = async () => {
    try {
      const categories = await fetchAllCategories()
      setCategories(categories)
    } catch (e) {
      setAlertNotification({
        type: "error",
        header: "Error fetching categories",
        content: "Could not fetch categories of items",
        isVisible: true,
      })
    }
  }

  const handleAuctionInfoChange = (inputId: string, inputValue: string) => {
    setAuctionInfoErrors((prevAuctionInfoErrors) => {
      return {
        ...prevAuctionInfoErrors,
        [inputId]: "",
      }
    })
    setAuctionInfo((prevAuctionInfo) => {
      return {
        ...prevAuctionInfo,
        [inputId]: inputValue,
      }
    })
  }

  const handleItemInfoChange = (inputId: string, inputValue: string) => {
    setItemInfoErrors((prevItemInfoErrors) => {
      return {
        ...prevItemInfoErrors,
        [inputId]: "",
      }
    })

    setItemInfo((prevItemInfo) => {
      return {
        ...prevItemInfo,
        [inputId]: inputValue,
      }
    })
  }

  const isErrorInImageUpload = (file: File | null) => {
    if (file === null) {
      return false
    }
    return file.size > MAX_ALLOWED_FILE_SIZE_IN_BYTES
  }

  const handleClickSubmit = async () => {
    const auctionResult = auctionSchema.safeParse(auctionInfo)
    const itemResult = itemSchema.safeParse(itemInfo)

    let imageFile: File | null = null
    if (imageSource.preview !== null) {
      imageFile = await dataUrlToFile(imageSource.preview, IMAGE_NAME)
    }

    if (
      itemResult.success &&
      auctionResult.success &&
      category?.value &&
      !isErrorInImageUpload(imageFile)
    ) {
      const auctionData = auctionResult.data
      const itemData = itemResult.data
      createAuctionMutation.mutate({
        auction: auctionData,
        item: itemData,
        categoryId: category.value,
        image: imageFile ?? undefined,
      })
      return
    }

    window.scrollTo(0, 0)

    if (isErrorInImageUpload(imageFile)) {
      setAuctionInfoErrors((prevAuctionInfoErrors) => {
        return {
          ...prevAuctionInfoErrors,
          selectedImage: "Please select a smaller image",
        }
      })
    }

    if (!auctionResult.success) {
      const errors = auctionResult.error.flatten()
      const fieldErrors = errors.fieldErrors
      forOwn(fieldErrors, (value, key) => {
        setAuctionInfoErrors((prevAuctionInfoErrors) => {
          return {
            ...prevAuctionInfoErrors,
            [key]: value,
          }
        })
      })
    }

    if (!itemResult.success) {
      const errors = itemResult.error.flatten()
      const fieldErrors = errors.fieldErrors
      forOwn(fieldErrors, (value, key) => {
        setItemInfoErrors((prevItemInfoErrors) => {
          return {
            ...prevItemInfoErrors,
            [key]: value,
          }
        })
      })
    }

    if (category === null) {
      setShowCategoryError(true)
    }
  }

  return (
    <div>
      <Form
        actions={
          <>
            <Button
              onClick={() => {
                navigate(-1)
              }}
              formAction="none"
              variant="link"
            >
              Cancel
            </Button>
            <Button onClick={handleClickSubmit} variant="primary">
              Submit
            </Button>
          </>
        }
        header={<Header variant="h1">Create Listing</Header>}
      >
        <Container>
          <SpaceBetween direction="vertical" size="l">
            <FormField label="Auction title" errorText={auctionInfoErrors.name}>
              <Input
                value={auctionInfo.name}
                onChange={(e) =>
                  handleAuctionInfoChange("name", e.detail.value)
                }
                placeholder={"Vintage furniture for sale..."}
              />
            </FormField>
            <FormField
              label="Auction description"
              errorText={auctionInfoErrors.description}
            >
              <Textarea
                value={auctionInfo.description}
                onChange={(e) =>
                  handleAuctionInfoChange("description", e.detail.value)
                }
                placeholder={"Selling rare victorian era chair..."}
              />
            </FormField>

            <FormField label="Item" errorText={itemInfoErrors.name}>
              <Input
                value={itemInfo.name}
                onChange={(e) => handleItemInfoChange("name", e.detail.value)}
                placeholder={"Vintage furniture for sale..."}
              />
            </FormField>
            <FormField
              label="Item specifications"
              errorText={itemInfoErrors.description}
            >
              <Textarea
                value={itemInfo.description}
                onChange={(e) =>
                  handleItemInfoChange("description", e.detail.value)
                }
                placeholder={"Selling rare victorian era chair..."}
              />
            </FormField>

            <FormField label="Category">
              <Select
                errorText={"Error loading categories"}
                invalid={showCategoryError}
                options={categories}
                selectedOption={category}
                onChange={(e) => {
                  setShowCategoryError(false)
                  const selectedOption = e.detail.selectedOption
                  setSelectedCategory(selectedOption)
                }}
                selectedAriaLabel="Selected"
                onLoadItems={handleLoadCategoryOptions}
                loadingText={"Loading Categories..."}
              />
            </FormField>

            <FormField
              label="Auction closing date"
              constraintText="Use YYYY/MM/DD format."
              errorText={auctionInfoErrors.closingTime}
            >
              <DatePicker
                onChange={({ detail }) => {
                  handleAuctionInfoChange("closingTime", detail.value)
                }}
                value={auctionInfo.closingTime}
                openCalendarAriaLabel={(selectedDate) =>
                  "Choose Auction closing date" +
                  (selectedDate ? `, selected date is ${selectedDate}` : "")
                }
                isDateEnabled={(date) => moment.utc(date).isAfter(moment.now())}
                nextMonthAriaLabel="Next month"
                placeholder="YYYY/MM/DD"
                previousMonthAriaLabel="Previous month"
                todayAriaLabel="Today"
              />
            </FormField>

            <FormField
              label="Starting Price"
              stretch={false}
              errorText={itemInfoErrors.startingPrice}
            >
              <Input
                value={itemInfo.startingPrice}
                onChange={(e) =>
                  handleItemInfoChange("startingPrice", e.detail.value)
                }
              />
            </FormField>

            <FormField
              label="Image"
              description="Adding an image equals more bids!"
              errorText={auctionInfoErrors.selectedImage}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>
                  <Avatar
                    width={250}
                    height={390}
                    exportAsSquare
                    onCrop={(preview) => {
                      setImageSource((prevImageSource) => {
                        return {
                          ...prevImageSource,
                          preview: preview,
                        }
                      })
                    }}
                    onClose={() => {
                      setImageSource((prevImageSource) => {
                        return {
                          ...prevImageSource,
                          preview: null,
                        }
                      })
                    }}
                  />
                </div>

                {imageSource.preview && (
                  <div style={{ margin: "1rem" }}>
                    <img
                      height={"250px"}
                      src={imageSource.preview}
                      alt={"Preview"}
                    />
                  </div>
                )}
              </div>
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </div>
  )
}

export default CreateListing
