const Bitcoin = require('bitcoin-address-generator')
const fs = require('fs')
const axios = require('axios')


const timeout = 100
const wallet = '1LQoWist8KkaUXSPKZHNvEyfrEkPHzSsCd'
let wallets = []
let count = 0
let maxWallets = 100
let keys = {}

const handleResponse = (res, keys) => {
  const data = res.data
  wallets.forEach(address => {
    let balance = 0
    try {
      balance = data[address].final_balance
    } catch (e) {}
    if (balance > 0) {
      const obj = {address, key: keys[address], balance}
      fs.appendFile('address.txt', JSON.stringify(obj) + '\n', error => console.error(error))
      console.log('write')
    }
  })
  wallets = []
}

const handleGeneratedWallet = generatedWallet => {
  const address = generatedWallet.address
  if (address === wallet) {
    const data = JSON.stringify(generatedWallet) + '\n'
    fs.appendFile('address.txt', data, error => console.error(error))
    console.log(generatedWallet)
  }
  wallets.push(address)
  keys[address] = generatedWallet.key
  count++
  if (count === maxWallets) {
    const adrs = wallets.join('|')
    let url = 'https://blockchain.info/balance?active=' + adrs
    axios
      .get(url)
      .then(res => handleResponse(res, keys))
      .catch(error => console.error(error))
    count = 0
  }
}

setInterval(() => {
  Bitcoin.createWalletAddress(generatedWallet => handleGeneratedWallet(generatedWallet))
}, timeout)
