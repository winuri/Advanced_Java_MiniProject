import { Button, Form, FormField, Input, SpaceBetween } from "@cloudscape-design/components";
import { forOwn } from "lodash";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AlertContext } from "../App";
import useRegister from "../hooks/useRegister";

const registerRequestSchema = z.object({
  userName: z.string().min(5).max(20),
  password: z.string().min(5).max(20),
  firstName: z.string().min(2).max(15),
  lastName: z.string().min(2).max(15),
})

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [userInfoErrors, setUserInfoErrors] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const navigate = useNavigate();
  const { setAlertNotification } = useContext(AlertContext);

  const handleMutationSuccess = () => {
    setAlertNotification({
      type: "success",
      header: "Registration Successful",
      content: "Successfully registered to Online Auction App. Welcome!",
      isVisible: true,
    })
    navigate("/")
  }

  const registerMutation = useRegister({ handleMutationSuccess: handleMutationSuccess });

  const handleClickSubmit = () => {
    const registerRequestValidation = registerRequestSchema.safeParse(userInfo);

    if (registerRequestValidation.success) {
      registerMutation.mutate({
        ...userInfo
      })
    } else {
      const errors = registerRequestValidation.error.flatten()
      const fieldErrors = errors.fieldErrors
      forOwn(fieldErrors, (value, key) => {
        setUserInfoErrors((prevErrors) => {
          return {
            ...prevErrors,
            [key]: value,
          }
        })
      })
    }
  }




  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: 'center',
      height: "100%"
    }}>
      <Form header={
        <h1>
          Register
        </h1>
      }>
        <SpaceBetween size={"s"} direction="vertical">


          <div style={{ display: "flex", gap: "1rem" }}>
            <FormField label="First Name" errorText={userInfoErrors.firstName}>
              <Input placeholder="John" value={userInfo.firstName} onChange={(e) => {
                setUserInfoErrors(userInfoErrors => {
                  return {
                    ...userInfoErrors,
                    firstName: ""
                  }
                })
                setUserInfo(loginInfo => {
                  return {
                    ...loginInfo,
                    firstName: e.detail.value,
                  }
                })
              }} />
            </FormField>

            <FormField label="Last Name" errorText={userInfoErrors.lastName}>
              <Input placeholder="Doe" value={userInfo.lastName} onChange={(e) => {
                setUserInfoErrors(userInfoErrors => {
                  return {
                    ...userInfoErrors,
                    lastName: ""
                  }
                })
                setUserInfo(loginInfo => {
                  return {
                    ...loginInfo,
                    lastName: e.detail.value,
                  }
                })
              }} />
            </FormField>
          </div>

          <FormField label="Username" errorText={userInfoErrors.userName}>
            <Input value={userInfo.userName} onChange={(e) => {
              setUserInfoErrors(userInfoErrors => {
                return {
                  ...userInfoErrors,
                  userName: ""
                }
              })
              setUserInfo(loginInfo => {
                return {
                  ...loginInfo,
                  userName: e.detail.value,
                }
              })
            }} />
          </FormField>
          <FormField label="Password" errorText={userInfoErrors.password}>
            <Input type="password" value={userInfo.password} onChange={(e) => {
              setUserInfoErrors(userInfoErrors => {
                return {
                  ...userInfoErrors,
                  password: ""
                }
              })
              setUserInfo(loginInfo => {
                return {
                  ...loginInfo,
                  password: e.detail.value
                }
              })
            }} />
          </FormField>


          <Button onClick={handleClickSubmit} variant="primary">Submit</Button>
        </SpaceBetween>
      </Form>
    </div>
  )

}


export default Register;
