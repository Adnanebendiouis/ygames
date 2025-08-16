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

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/homelist/?page=1`);
      const resP = await fetch(`${API_BASE_URL}/api/filter/?category=PlayStation&page=1`);
      const resX = await fetch(`${API_BASE_URL}/api/filter/?category=Xbox&page=1`);

      const data = await response.json();
      const dataP = await resP.json();
      const dataX = await resX.json();

      setProducts(data.results || []);
      setCategoryP(dataP.results || dataP);
      setCategoryX(dataX.results || dataX);

    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // ✅ only run once

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
