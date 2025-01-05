import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";
import { useParams } from "react-router-dom";
import "../../styles/shop.css";


// All Services Page Component
function Shop() {
  const { Shop } = useParams();
  const [categories, setCategories] = useState([]);
  console.log(categories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await makeApi(`/api/get-shops-by-subcategories-name/${Shop}`, "GET");
        setCategories(response.data.subcategories);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <>
      {loading ? (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }} >
          <Loader />
        </div>
      ) : (
        <div className="all-services-page">
          <div className="services-container-shop">
            {categories.map((service) => (
              <motion.div
                className="service-card"
                key={service._id}
                initial={{ scale: 0.8, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  to={`/product/${service.name}`}
                  className="service-link"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="service-image-shop"
                  />
                  <div className="service-details">
                    <h2 className="service-title">{service.name} </h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Shop;
