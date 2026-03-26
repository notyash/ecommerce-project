import HomePage from "./pages/Home";
import { Routes, Route } from 'react-router'
import ProductsPage from "./pages/Products";
import DevelopersPage from "./pages/Developers";
import SupportPage from "./pages/Support";
import ContactsPage from "./pages/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/developers" element={<DevelopersPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/contact" element={<ContactsPage />} />
      <Route path="/sign-in" element={<ContactsPage />} />
    </Routes>
  );
}

export default App;
