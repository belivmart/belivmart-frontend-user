// import "../../styles/allservice.css";
// import { Link } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";

// // All Services Page Component
// function Servicetype() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         setLoading(true);
//         const response = await makeApi("/api/get-all-categories", "GET");
        

//         // Sort the categories array based on the `poistionId` field
//         // const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

//         setCategories(response.data.categories);
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }} >
//         <Loader />
//         </div>
//       ) : (
//         <div className="all-services-page">
//           <div className="services-container">
//             {categories.map((service) => (
//               <motion.div
//                 className="service-card"
//                 key={service._id} // Using _id as the key to ensure uniqueness
//                 initial={{ scale: 0.8, y: 100 }}
//                 animate={{ scale: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//               > 
//                 <Link
//                   to={`/${service.name.toLowerCase()}`}
//                   className="service-link"
//                 >
//                   <img
//                     src={service.image}
//                     alt={service.name}
//                     className="service-image"
//                   />
//                   <div className="service-details">
//                     <h2 className="service-title">{service.name}</h2>
//                   </div>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Servicetype;

import "../../styles/allservice.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";
import { useParams } from "react-router-dom";


// All Services Page Component
function Subcatogytype() {
      const { serivcetype } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await makeApi(`/api/get-subcategories-category-name/${serivcetype}`, "GET");

        // Sort the categories array based on the `poistionId` field
        const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

        setCategories(sortedCategories);
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
          <div className="services-container">
            {categories.map((service) => (
              <motion.div
                className="service-card"
                key={service._id} 
                initial={{ scale: 0.8, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  to={`/shop/${service.name}`}
                  className="service-link"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="service-image"
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

export default Subcatogytype;
