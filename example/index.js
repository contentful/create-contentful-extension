import React from "react"
import ReactDOM from "react-dom"
import JsonPrinter from './json-printer'

export default function(api) {
  const app = document.createElement('div');
  document.body.appendChild(app)
  ReactDOM.render(<JsonPrinter obj={api} />, app)
}
