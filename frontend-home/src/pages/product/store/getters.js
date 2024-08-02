const getter__allProducts = (state) => {
  return state.allProducts;
};

const getProductData = (state) => {
  return state.productData;
};

const getOrdersData = (state) => {
  return state.ordersData;
};

export { getter__allProducts, getProductData, getOrdersData };
