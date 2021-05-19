import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import App from "../components/App";

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
  jest.restoreAllMocks();
});

it("can render App component and show empty todos message", async () => {
  // you need to wait for the component to complete rendering and state changes
  // to prevent "An update to <Component /> inside a test was not wrapped in act" warning
  await act(async () => {
    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve([]),
      };
      return Promise.resolve(fetchResponse);
    });
    render(<App />, container);
  });
  const button = await container.querySelector("[data-cy=add-todo-button]");
  // the first add string is from Material Icon and the second Add is the text shown to user
  expect(button.textContent).toEqual("addAdd");

  const emptyComponent = await container.querySelector("[data-cy=empty-todos]");
  expect(emptyComponent.textContent).toEqual(
    "You don't have any todos yet. Let's add and complete them!!!"
  );
});
