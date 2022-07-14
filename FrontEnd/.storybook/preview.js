require('../src/App.css')
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

import { addDecorator } from "@storybook/react"
import React from "react"
import { MemoryRouter } from "react-router"

addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>);