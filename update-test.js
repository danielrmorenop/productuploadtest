//60637
const axios = require("axios");
let token = "";

axios
  .post("https://www.loginsvc.com/wp-json/jwt-auth/v1/token", {
    username: "Daniel",
    password: "Fre3b@ndz"
  })
  .then(function(response) {
    token = response.data.token;
    headerToken = "Bearer " + token;
    getProductInfo(headerToken, "60637");
    updateProduct(headerToken, "60637")
  })
  .catch(function(error) {
    console.log(error);
  });

const updateProduct = (headerToken, ID) => {
  axios({
    headers: {
        Authorization: headerToken
      },
    method: "put",
    url: `https://loginsvc.com/wp-json/dokan/v1/products/60637`,
    data: {
      images: [{
          src:
            "https://www.loginsvc.com/wp-content/uploads/2018/08/logo-opt-3.png",
        position: 1
        }
      ]
    }
  })
  .then(response=>{console.log(response.data)});
};

const getProductInfo = (headerToken, ID) => {
  axios
    .get("https://loginsvc.com/wp-json/dokan/v1/products/60637", {
      headers: {
        Authorization: headerToken
      }
    })
    .then(response => {
      console.log(response.data);
    });
};
