import { useEffect, useState } from "react";
import type { Product } from "../types/types";
import { API_BASE_URL } from "../constants/baseUrl";
import { Box } from "@mui/material";
import ProductsCard from "./ProductsCard";
import PsProductsCard from "./PsProductsCard";
import XbProductsCard from "./XbProductsCard";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryP, setCategoryP] = useState<Product[]>([]);
  const [categoryX, setCategoryX] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ added loading state

  const fetchData = async () => {
    try {
      // ✅ check sessionStorage first
      const cachedHome = sessionStorage.getItem("homeProducts");
      const cachedP = sessionStorage.getItem("psProducts");
      const cachedX = sessionStorage.getItem("xbProducts");

      if (cachedHome && cachedP && cachedX) {
        setProducts(JSON.parse(cachedHome));
        setCategoryP(JSON.parse(cachedP));
        setCategoryX(JSON.parse(cachedX));
        setLoading(false); // ✅ stop loading
        return;
      }

      // fetch data from API
      const response = await fetch(`${API_BASE_URL}/api/homelist/?page=1`);
      const resP = await fetch(`${API_BASE_URL}/api/filter/?category=PlayStation&page=1`);
      const resX = await fetch(`${API_BASE_URL}/api/filter/?category=Xbox&page=1`);

      const data = await response.json();
      const dataP = await resP.json();
      const dataX = await resX.json();

      const homeProducts = data.results || [];
      const psProducts = dataP.results || dataP;
      const xbProducts = dataX.results || dataX;

      setProducts(homeProducts);
      setCategoryP(psProducts);
      setCategoryX(xbProducts);
      setLoading(false); // ✅ stop loading

      // store in sessionStorage
      sessionStorage.setItem("homeProducts", JSON.stringify(homeProducts));
      sessionStorage.setItem("psProducts", JSON.stringify(psProducts));
      sessionStorage.setItem("xbProducts", JSON.stringify(xbProducts));

    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false); // ✅ stop loading in case of error
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // ✅ only run once per session

  if (loading)
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Box>
    );

  if (error) {
    return <Box>Une erreur s'est produite. Veuillez réessayer.</Box>;
  }

  return (
    <div>
      <ProductsCard products={products} />
      <PsProductsCard products={categoryP} />
      <XbProductsCard products={categoryX} />
    </div>
  );
};

export default HomePage;
