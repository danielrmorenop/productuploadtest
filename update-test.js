const axios = require("axios");
let token = "";
const WooCommerceAPI = require("woocommerce-api");

// WooCommerce Starts Here
var WooCommerce = new WooCommerceAPI({
  url: "https://www.loginsvc.com",
  consumerKey: "ck_301d4de52b4f641020ca845edf3bb576af9b4eec",
  consumerSecret: "cs_083a60f5158a576deacf1b749f46ba18cb2b17b0",
  wpAPI: true,
  version: "wc/v3",
  queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
});

axios
  .post("https://www.loginsvc.com/wp-json/jwt-auth/v1/token", {
    username: "Daniel",
    password: "Fre3b@ndz"
  })
  .then(function(response) {
    token = response.data.token;
    headerToken = "Bearer " + token;

    const storeId = getStoreID(headerToken);
  })
  .catch(function(error) {
    console.log(error);
  });

// Get Store ID
// https://loginsvc.com/wp-json/dokan/v1/products?per_page=100
const getStoreID = headerToken => {
  axios
    .get("https://loginsvc.com/wp-json/dokan/v1/stores?per_page=50", {
      headers: {
        Authorization: headerToken
      }
    })
    .then(
      response => {
        const storeIdArray = [];
        response.data.map(store => {
          storeIdArray.push(store.id);
        });
        console.log(storeIdArray);
        storeIdArray.forEach(id => {
          getStorePic(headerToken, id);
        });
      },
      error => {
        console.log(error);
      }
    );
};

const getStorePic = (headerToken, storeId) => {
  axios
    .get(`https://loginsvc.com/wp-json/dokan/v1/stores/${storeId}`, {
      headers: {
        Authorization: headerToken
      }
    })
    .then(response => {
      console.log(response.data.gravatar);
      const gravatar = response.data.gravatar;
      if (gravatar) {
        getAllProducts(headerToken, storeId, gravatar);
      }
    });
};

const getAllProducts = (headerToken, storeID, gravatar) => {
  axios
    .get(
      `https://loginsvc.com/wp-json/dokan/v1/stores/${storeID}/products?per_page=100`,
      {
        headers: {
          Authorization: headerToken
        }
      }
    )
    .then(response => {
      const productArray = [];
      response.data.map(product => {
        //console.log (product.id)
        productArray.push(product.id);
      });
      console.log(productArray);
      if (productArray.length<200&&productArray.length>0) {
        productArray.forEach(productID => {
          updateProduct(productID, gravatar);
        });
      }
    });
};

// Image Update
async function updateProduct (productID, gravatar) {
  var data = {
    images: [
      {
        src: gravatar
      }
    ]
  };
  console.log ("attempting to update product: " + productID);
  console.log (gravatar + "\n\n")
  await WooCommerce.put(`products/${productID}`, data, function(err, data, res) {
   if (res){ console.log(JSON.parse(res));}
   if (err) {console.log(err)};
  });
  // End Image Update
};
