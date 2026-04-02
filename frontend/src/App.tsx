import HomePage from "./pages/Home";
import { Routes, Route } from 'react-router'
import ProductsPage from "./pages/Products";
import CartPage from "./pages/Cart";
import SupportPage from "./pages/Support";
import ContactsPage from "./pages/Contact";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/contact" element={<ContactsPage />} />
              <Route path="/sign-in" element={<ContactsPage />} />
          </Routes>
        </CartProvider>

      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>

  );
}

export default App;
