const commit__getAllProducts = (state, data) => {
  state.allProducts = data;
};

const getProduct = (state, data) => {
  state.productData = data;
};

const getOrders = (state, data) => {
  state.ordersData = data;
};

export { commit__getAllProducts, getProduct, getOrders };
