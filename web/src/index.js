import "./App.css"
import React from "react"
import ReactDOM from "react-dom"
import reportWebVitals from "./reportWebVitals"
//import {Switch, Route} from "react-router-dom"

import {Providers} from "./global/providers.comp"

import {Page as RootPage} from "./pages/root.page"
//import {Page as NotFound} from "./pages/not-found.page"

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import "./global/config"
import "./font.css"

window.fcl = fcl
window.t = t

ReactDOM.render(
  <Providers>
      <RootPage />
  </Providers>,
  document.getElementById("root")
)

reportWebVitals()