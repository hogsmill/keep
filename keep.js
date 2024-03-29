const fs = require('fs')

function getCustomers() {
  return JSON.parse(fs.readFileSync('customers.json', 'utf8'))
}

function getApps() {
  return JSON.parse(fs.readFileSync('apps.json', 'utf8'))
}

function getActiveApps(apps) {
  const activeApps = []
  for (let i = 0; i < apps.length; i++) {
    if (apps[i].active == "yes") {
      activeApps.push(apps[i])
    }
  }
  return activeApps
}

function customerRoutes(customer, apps) {
  const customerApps = []
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i]
    const route = customer.route ? app.route + '-' + customer.route : app.route
    app.route = route
    customerApps.push(app)
  }
  return customerApps
}

// Customer levels:
//  1 - Use
//  2 - Regular Use
//  3 - Dedicated (ABN)
//  4 - Admin
//
function getCustomerApps(customer, apps) {
  let customerApps = []
  if (customer.level == "Single Game") {
    customerApps.push(customer.game)
  } else {
    for (let i = 1; i <= 4; i++) {
      if (customer.level >= i) {
        let useApps = apps.find((a) => {
          return a.level == i
        }).apps
        useApps = getActiveApps(useApps)
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
    const envFile = '/usr/apps/' + app.route + '/.env'
    if (fs.existsSync(envFile)) {
      const env = fs.readFileSync(envFile, 'utf8')
      app.port = env.match(/VUE_APP_PORT=([0-9]+)/) ? env.match(/VUE_APP_PORT=([0-9]+)/)[1] : 0
    } else {
      app.port = 0
    }
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
  customerApps = customerRoutes(customer, customerApps)
  customerApps = customerPorts(customerApps)
  for (j = 0; j < customerApps.length; j++) {
    const route = customer.route ? customer.route : 'default'
    const app = customerApps[j]
    const appDef = [route, app.port, app.route, app.name].join(',') + '\n'
    fs.writeFileSync('customerApps.txt', appDef, { flag: 'a+' }, err => {})
  }
}
