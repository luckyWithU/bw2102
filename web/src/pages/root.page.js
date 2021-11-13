import {Base} from "../components/base.comp"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {Redirect} from "react-router-dom"
import {Heading, Button} from "@chakra-ui/react"

import {Page as Main} from "./main/index"
//import Logo from ""

export function Page() {
  const [user, loggedIn, {signUp, logIn}] = useCurrentUser()

  if (loggedIn)
    return <Main />
  else
    return (
      <Base>
        <div className="login-page">
            <div className="logo"><Heading>2102BW MVP</Heading></div>
            <div className="button-area">
              <Button colorScheme="blue" mr={2} onClick={logIn}>Log In</Button>
              <Button colorScheme="teal" ml={2} onClick={signUp}>Sign Up</Button>
            </div>
        </div>
      </Base>
    )
}
