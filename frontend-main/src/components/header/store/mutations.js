const currentSeller = (state, data) => {
  localStorage.setItem('authToken', data.token)
  state.sellerData = data
}

const currentUser = (state, data) => {
  localStorage.setItem('authToken', data.token)
  state.userData = data
}

const setLocation = (state, data) => {
  state.locationData = data
}

const togglePanel = (state, data) => {
  state.panelVisible = data
}

const connectWallet = (state, data) => {
  state.walletConnected = data.value
  state.walletName = data.name
}

const setupLucid = (state, data) => {
  state.lucidClient = data
}

const setADAprice = (state, data) => {
  state.ADAprice = data
}
export { setLocation, currentUser, connectWallet, togglePanel, currentSeller, setupLucid, setADAprice }
