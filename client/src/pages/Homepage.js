import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { Row, Col } from "antd";
import ItemList from "../components/ItemList";

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Soup");
  const categories = [
    {
      name: "Soup",
      imageUrl:
        "https://pngimg.com/uploads/soup/soup_PNG111.png",
    },
    {
      name: "Salad",
      imageUrl:
        "https://www.freeiconspng.com/uploads/greek-salad-png-21.png" ,
    },
    {
      name: "Wrap",
      imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdlm0smHGfg882RCo6VE-go1O5F8Rz6rr2sSQoIAqFLTIGJwgZpGduo7yMlt5figRem0s&usqp=CAU",
      
    },
   
    {
      name: "Bowl",
      imageUrl:
        "https://www.seekpng.com/png/full/28-280382_barburrito-burrito-bowl.png",
    },
    {
      name: "Juice",
      imageUrl:
        "https://www.pngitem.com/pimgs/m/126-1267508_fruit-smoothies-smoothies-png-transparent-png.png",
    },
  ];
  //implementation of useEffect hook
  useEffect(() => {
    const getAllItems = async () => {
      try {
        const { data } = await axios.get("/api/items/get-item");
        setItemsData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, []);

  return (
    <DefaultLayout>
      <div className="category">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`categoryFlex ${
              selectedCategory === category.name && "category-active"
            }`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <h4 className="categoryName">{category.name}
            <img
              src={category.imageUrl}
              alt={category.name}
              height={55}
              width={55}
            /></h4>
           
          </div>
        ))}
      </div>
      <Row>
        {itemsData
          .filter((i) => i.category === selectedCategory)
          .map((item) => (
            <Col xs={24} lg={6} md={12} sm={6}>
              <ItemList key={item.id} item={item} />
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
