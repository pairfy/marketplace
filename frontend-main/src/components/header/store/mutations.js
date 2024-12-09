const currentSeller = (state, data) => {
  state.sellerData = data;
};

const currentUser = (state, data) => {
  state.userData = data;
};

const showPanel = (state, data) => {
  state.drawerVisible = data;
};

const connectWallet = (state, data) => {
  state.walletConnected = data.value;
  state.walletName = data.name;
};

const setupLucid = (state, data) => {
  state.lucidClient = data;
};

const setADAprice = (state, data) => {
  state.ADAprice = data;
};
export { currentUser, connectWallet, showPanel, currentSeller, setupLucid, setADAprice };
