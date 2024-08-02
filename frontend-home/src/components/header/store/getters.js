const getCurrentSeller = (state) => {
  return state.sellerData;
};

const getCurrentUser = (state) => {
  return state.userData;
};

const getDisplaySetupWallet = (state) => {
  return state.displaySetupWallet;
};

const getLucid = (state) => {
  return state.lucidClient;
};

export { getCurrentUser, getCurrentSeller, getDisplaySetupWallet, getLucid };
