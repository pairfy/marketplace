/**GETTER */
const getProductsData = (state) => {
  return state.productsData;
};

const getSlotsData = (state) => {
  return state.slotsData;
};

const getLucid = (state) => {
  return state.lucidClient;
};

export { getProductsData, getSlotsData, getLucid };
