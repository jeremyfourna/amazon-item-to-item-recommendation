const {
  __,
  append,
  assoc,
  compose,
  concat,
  contains,
  evolve,
  filter,
  find,
  forEach,
  length,
  lte,
  map,
  pair,
  prop,
  propEq,
  reduce,
  unnest
} = require('ramda');
const products = require('./data/products.json');
const customers = require('./data/customers.json');



/*
For each item in product catalog, I1
  For each customer C who purchased I1
    For each item I2 purchased by customer C
      Record that a customer purchased I1 and I2
    For each item I2
      Compute the similarity between I1 and I2
*/

// OK
function itemRelationToCustomerPurchases(product, customer) {
  return filter(
    productId => productId !== product.id,
    customer.productsPurchased
  );
}

// OK
function findCustomersWhoPurchasedProduct(product, customers) {
  return filter(
    customer => contains(product.id, customer.productsPurchased),
    customers
  );
}

// OK
function assignCustomersToProduct(product, customers) {
  return compose(
    assoc('purchasedBy', __, product),
    reduce((prev, customer) => append(customer.id, prev), []),
    filter(customer => contains(product.id, customer.productsPurchased))
  )(customers);
}

// Fail
function itemToItemReco(products, customers) {
  return forEach(product => {
    const customersWhoBoughtSomethingElse = compose(
      keepCustomersWhoBoughtSomeOtherProducts(product, __),
      findCustomersWhoPurchasedProduct(product, __)
    )(customers);
    console.log('customersWhoBoughtSomethingElse', product.id, customersWhoBoughtSomethingElse);
    const recordRelation = recordRelationbetweenItems(product, customersWhoBoughtSomethingElse);
    console.log('recordRelation', product.id, recordRelation);
  }, products);
}

function keepCustomersWhoBoughtSomeOtherProducts(product, customers) {
  return filter(customer => lte(2, length(customer.productsPurchased)), customers);
}

function recordRelationbetweenItems(product, customers) {
  return map(customer => {
    const listOfProducts = itemRelationToCustomerPurchases(product, customer);
    return compose(
      reduce((prev, cur) => {
        console.log(customer.id, cur);
        return append(prev, cur);
      }, []),
      map(p => pair(product.id, p))
    )(listOfProducts);
  }, customers);
}

// Fail
function prepareResult(products) {
  return reduce((prev, cur) => {
    return assoc(cur.id, [], prev);
  }, {}, products);
}


//console.log(itemRelationToCustomerPurchases(products[0], customers[3]));
//console.log(findCustomersWhoPurchasedProduct(products[2], customers));
//console.log(assignCustomersToProduct(products[0], customers));
console.log(itemToItemReco(products, customers));
