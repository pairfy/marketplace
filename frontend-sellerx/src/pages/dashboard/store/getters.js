/**GETTER */
const getProductsData = (state) => {
  return state.productsData;
};

const getOrdersData = (state) => {
  return state.ordersData;
};

const getLucid = (state) => {
  return state.lucidClient;
};

export { getProductsData, getOrdersData, getLucid };
