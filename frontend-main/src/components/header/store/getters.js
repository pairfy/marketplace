const getCurrentSeller = (state) => {
  return state.sellerData;
};

const getCurrentUser = (state) => {
  return state.userData;
};

const getLocationData = (state) => {
  return state.locationData;
};

const panelVisible = (state) => {
  return state.panelVisible;
};

const getLucid = (state) => {
  return state.lucidClient;
};

const getADAprice = (state) => {
  return state.ADAprice;
};

export { getLocationData, getCurrentUser, getCurrentSeller, panelVisible, getLucid, getADAprice};
