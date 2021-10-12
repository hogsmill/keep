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
    console.log('route', app.route, customer.route, route)
    app.route = route
    customerApps.push(app)
  }
  return customerApps
}

// Customer levels:
//  1 - Use
//  2 - Regular Use
//  3 - All
//
function getCustomerApps(customer, apps) {
  let customerApps = []
  if (customer.level == "Single Game") {
    customerApps.push(customer.game)
  } else {
    for (let i = 1; i <= 3; i++) {
      if (customer.level >= i) {
        const useApps = apps.find((a) => {
          return a.i == customer.level
        }).apps
        customerApps = customerApps.concat(useApps)
      }
    }
  }
  return customerApps
}

function customerPorts(apps) {
  let customerApps = []
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i]
    envFile = fs.readFileSync('/usr/apps/' + app.route + '/.env', 'utf8')
    app.port = envFile.match(/VUE_APP_PORT=([0-9]+)/)[1]
    customerApps.push(app)
  }
  return customerApps
}

const customers = getCustomers()
if (fs.existsSync('customerApps.txt')) {
  fs.unlinkSync('customerApps.txt')
}
for (let i = 0; i < customers.length; i++) {
  const customer = customers[i]
  let customerApps = getCustomerApps(customer, getApps())
  console.log('-----------------------------')
  customerApps = customerRoutes(customer, customerApps)
  customerApps = customerPorts(customerApps)
  for (j = 0; j < customerApps.length; j++) {
    const app = customerApps[j]
    const appDef = [customer.route, app.port, app.route, app.name].join(',') + '\n'
    fs.writeFile('customerApps.txt', appDef, { flag: 'a+' }, err => {})
  }
}
