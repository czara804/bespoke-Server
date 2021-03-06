const mongoose = require("mongoose");
const expect = require("expect");
const utilities = require('../utils/product_utilities');
const Product = require('../models/product');
const {connectToDb, disconnectFromDb} = require('./config')

let productId = null
before((done) => {
  // Connect to the database (same as we do in app.js)
  connectToDb(done);
});

after((done) => {
  disconnectFromDb(done);
})

beforeEach(async function () {
  // Load a test record in setupData
  // Use await so we can access the productId, which is used by some tests
  let product = await setUpData();
  productId = product._id;
  });
  
  // Delete test data after each test
afterEach((done) => {
  // Execute the deleteMany query
  tearDownData().exec(() => done());
});


describe("getAllProducts when there is one product", (done) => {
  it("should get a product if a product exists", function(done) {
    let req = {
      query: {}
    }
    //products should be 1 so use object.keys to get an array to find length
  utilities.getAllProducts(req).exec((err, products) => {
    expect(Object.keys(products).length).toBe(1);
    done();
  })
  })
  it("should have nail_shape be squoval", async function() {
    let req = {
      query: {}
    }
  await utilities.getAllProducts(req).exec((err, products) => {
    expect(products[0].nail_shape).toBe("squoval");
  })
  })
})

describe("Add a product", (done) => {
  it("should add a product", function(done){
    let req = {
      body: {
        nail_length: 30,
        nail_shape: "stiletto",
        nail_style: "hologram",
        cost: 20,
        image: {
          fileLink: "aws.test.com/image.png/123"
        }
      }
    }
  utilities.addProduct(req).save((err, product) => {
    expect(product.nail_length).toBe(req.body.nail_length)
    done()
  })
  })
}
)

describe("Get product by id", (done) => {
  it("It should get a product with nail style of planets", function(done){
    let req = {
      params: {
        id: productId
      }
    }
    utilities.getProductById(req).exec((err, product) => {
      expect(product.nail_style).toBe("planets")
      done()
    })
  })
})

describe("Delete product", (done) => {
  it("Should delete the specified product", function (done){
    utilities.deleteProduct(productId).exec(() => {
      Product.findById(productId).exec((err, product) => {
        expect(product).toBe(null)
        done()
      })
    })
  })
})

describe('updateProduct', (done) => {
  it('Should update a product', function (done) {
      // set up a req object
      const req = {
          params: {
              id: productId
          },
          body: {
              nail_length: 25,
              nail_shape: "round",
              nail_style: "aztec",
              cost: 25,
              image: {
                fileLink: "aws.test.com/image.png/123"
              }
          }};
      utilities.updateProduct(req).exec((err, product) => {
          expect(product.nail_style).toBe(req.body.nail_style);
          done();
      });
  });
});

//helper functions
function setUpData() {
  let testProduct = {}
  testProduct.nail_length = 20;
  testProduct.nail_shape = "squoval";
  testProduct.nail_style = "planets";
  testProduct.cost = 20;
  testProduct.image = {}
  testProduct.image.fileLink = "aws.test.com/image.png/123";
  return Product.create(testProduct)
}

function tearDownData() {
  return Product.deleteMany()
}
