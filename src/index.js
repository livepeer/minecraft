import 'babel-polyfill'
import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from './state'
import App from './App'

render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
)
