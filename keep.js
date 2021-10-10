const fs = require('fs')

function getCustomers() {
  return JSON.parse(fs.readFileSync('customers.json', 'utf8'))
}

function getApps() {
  return JSON.parse(fs.readFileSync('apps.json', 'utf8'))
}

function customerRoutes(customer, apps) {
  const customerApps = []
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i]
    const route = app.route + '-' + customer.route
    app.route = route
    customerApps.push(app)
  }
  return customerApps
}

function getCustomerApps(customer, apps) {
  let customerApps = []
  const useApps = apps.find((a) => {
    return a.name == 'Use'
  }).apps
  customerApps = customerApps.concat(useApps)
  if (customer.level == "Regular Use") {
    const regularUseApps = apps.find((a) => {
      return a.name == 'Regular Use'
    }).apps
    customerApps = customerApps.concat(regularUseApps)
  }
  return customerApps
}

function customerPorts(apps) {
  let customerApps = []
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i]
    envFile = fs.readFileSync('/usr/apps/' + app.route + '/.env', 'utf8')
    const port = envFile.match(/VUE_APP_PORT=([0-9]+)/)
    console.log(port)
  }
}

const customers = getCustomers()
for (let i = 0; i < customers.length; i++) {
  const customer = customers[i]
  console.log(customer.name)
  let customerApps = getCustomerApps(customer, getApps())
  customerApps = customerRoutes(customer, customerApps)
  customerApps = customerPorts(customerApps)
}