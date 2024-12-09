const createProduct = (state, data) => {
  state.productsData.push(data);
};

const getProducts = (state, data) => {
  state.productsData.length = 0;
  state.productsData.push(...data);
};

const getOrders = (state, data) => {
  state.ordersData.length = 0;
  state.ordersData.push(...data);
};

const setupLucid = (state, data) => {
  state.lucidClient = data;
};

export { setupLucid, createProduct, getProducts, getOrders };
