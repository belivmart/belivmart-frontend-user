import { Route, Routes } from "react-router-dom";

import "./App.css";
import CartPage from "./components/weddigservice/CartPage";
import Productpage from "./components/weddigservice/servicedetails";
import AllServicesPage from "./components/weddigservice/allservice"
import Subcatogayall from "./components/weddigservice/subcatogey";
import Servicetype from "./components/weddigservice/servicetype";
import Subcatogytype from "./components/weddigservice/servicetype";
import Shop from "./components/weddigservice/shop";
function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<AllServicesPage />} />
 
        <Route path="/:serivcetype" element={<Subcatogytype />} />
        <Route path="/shop/:Shop" element={<Shop />} />
        <Route path="/product/:subcategory" element={<Productpage />} />

        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  );
}

export default App;
