const {
  assoc,
  compose,
  concat,
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

function prepareResult(products) {
  return reduce((prev, cur) => {
    return assoc(cur.id, [], prev);
  }, {}, products);
}


const result = itemToItemReco(products, customers);


console.log(result);
