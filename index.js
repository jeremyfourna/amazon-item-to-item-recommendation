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
  map,
  prop,
  propEq,
  reduce
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
function findCustomersWhoPurchasedItem(customers, product) {
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
  return reduce((table, product) => {
    const itemsLinkedToProduct = map(customer => {
      return compose(
        filter(p => p !== product.id),
        prop('productsPurchased'),
        find(propEq('id', customer))
      )(customers);
    }, product.purchasedBy);
    const transformations = {
      [product.id]: concat(itemsLinkedToProduct)
    };
    return evolve(transformations, table);
  }, prepareResult(products), products);
}

// Fail
function prepareResult(products) {
  return reduce((prev, cur) => {
    return assoc(cur.id, [], prev);
  }, {}, products);
}


//const result = itemToItemReco(products, customers);

//console.log(itemRelationToCustomerPurchases(products[0], customers[1]));
//console.log(findCustomersWhoPurchasedItem(customers, products[2]));
//console.log(assignCustomersToProduct(products[0], customers));
//console.log(result);