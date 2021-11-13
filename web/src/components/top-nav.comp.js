/* eslint-disable */
import {Suspense} from "react"
import {useInitialized} from "../hooks/use-initialized.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
import {
  Box,
  Button,
  Heading,
  Spacer
} from "@chakra-ui/react"
import { Navbar } from "react-bootstrap"

export function TopNav({address}) {
  const init = useInitialized(address)
  const [user, loggedIn, {signUp, logIn, logOut}] = useCurrentUser()
  if (address == null) return null

  return (
        <Navbar className="p-2 ps-3 pe-3" bg="dark" variant="dark">
          <Navbar.Brand><Heading as="h4" size="lg">2102BW</Heading></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Spacer />
          <Box>
            <span className="white-color mr-2">{user.addr}</span>
            {!init.isInitialized && address === user.addr && (
            <Button
              colorScheme="blue"
              ml={2}
              disabled={init.status !== IDLE}
              onClick={init.initialize}
            >
              1. Initialize
            </Button>
            )}
            <Button colorScheme="green" ml={2} onClick={logOut}>Log Out</Button>
          </Box>
        </Navbar>
  )
}

export default function WrappedTopNav(props) {
  const [cu] = useCurrentUser()
  if (cu.addr !== props.address) return null

  return (
    <Suspense
      fallback={
        <></>
      }
    >
      <TopNav {...props} />
    </Suspense>
  )
}
