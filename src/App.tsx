import HomePage from "./components/Home";
import { Routes, Route } from 'react-router'
import ProductsPage from "./components/ProductsPage";

function App() {


  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}

export default App;
