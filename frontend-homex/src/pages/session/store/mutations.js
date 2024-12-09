
const getOrder = (state, data) => {
  state.orderData = data;
};

const returnable = (state, data) => {
  state.returnable = data;
};

export {
  getOrder,
  returnable
};
