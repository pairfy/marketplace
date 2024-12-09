const currentSeller = (state, data) => {
  state.sellerData = data;
};

const currentUser = (state, data) => {
  state.userData = data;
};

const displaySetupWallet = (state, data) => {
  state.displaySetupWallet = data;
};

const connectWallet = (state, data) => {
  state.walletConnected = data.value;
  state.walletName = data.name;
};

const setupLucid = (state, data) => {
  state.lucidClient = data;
};
export { currentUser, connectWallet, displaySetupWallet, currentSeller, setupLucid };
