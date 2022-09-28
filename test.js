const axios = require('axios')
let wallet = '1JL5CrbMhs6xVPqpyVavBCmAtYkY18mNuM|1MDUoxL1bGvMxhuoDYx6i11ePytECAk9QK';
const url = 'https://blockchain.info/balance?active=' + wallet
axios
  .get(url)
  .then(res => {
    console.log(res.data)
    console.log(res.data[wallet.substring(0, wallet.indexOf('|'))].final_balance)
  })
  .catch(error => console.error(error))
