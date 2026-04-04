import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { RouterProvider } from "react-router/dom"
import { ThemeProvider } from "./theme/ThemeProvider";
import { router } from "./router"
import { store } from "./store"
import { setupInterceptors } from './api/interceptors';
import { fetchMe } from './store/authSlice';
import { fetchCart } from './store/cartSlice';
import "./index.css"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)
  setupInterceptors()

  store.dispatch(fetchMe());
  store.dispatch(fetchCart());

  root.render(
    <StrictMode>
      <ThemeProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
    </StrictMode>
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
