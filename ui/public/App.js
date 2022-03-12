const div = document.getElementById('data');

function ProductTable(props) {
  const productRows = props.products.map(product => {
    return /*#__PURE__*/React.createElement(ProductRow, {
      key: product.id,
      product: product
    });
  });
  return /*#__PURE__*/React.createElement("table", {
    width: "100%"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Price"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "ImageURL"))), /*#__PURE__*/React.createElement("tbody", null, productRows));
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.addProduct;
    const product = {
      productName: form.productName.value,
      productPrice: parseFloat(form.productPrice.value.substring(1)),
      productCategory: form.productCategory.value,
      productImageUrl: form.productImageUrl.value
    };
    this.props.createProduct(product);
    form.productName.value = "";
    form.productPrice.value = "$";
    form.productCategory.value = "";
    form.productImageUrl.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "addProduct",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("h2", null, "Add a new product to inventory"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
      id: "content"
    }, /*#__PURE__*/React.createElement("div", {
      id: "left",
      align: "left"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Category"), /*#__PURE__*/React.createElement("select", {
      id: "list",
      name: "productCategory"
    }, /*#__PURE__*/React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), /*#__PURE__*/React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), /*#__PURE__*/React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), /*#__PURE__*/React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), /*#__PURE__*/React.createElement("option", {
      value: "Accessories"
    }, "Accessories"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Price Per Unit"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "productPrice",
      defaultValue: "$"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", null, "Add Product"))), /*#__PURE__*/React.createElement("div", {
      id: "right"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Product Name"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "productName"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Image URL"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "productImageUrl"
    })))));
  }

}

function ProductRow(props) {
  const product = props.product;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, product.productName), /*#__PURE__*/React.createElement("td", null, new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.productPrice)), /*#__PURE__*/React.createElement("td", null, product.productCategory), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: product.productImageUrl,
    target: "_blank"
  }, "View")));
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
            productList {
              id
              productName
              productPrice
              productCategory
              productImageUrl
            }
          }`;
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const body = await response.text();
    const result = JSON.parse(body);
    this.setState({
      products: result.data.productList
    });
  }

  async createProduct(product) {
    const query = `mutation addProduct($product: ProductInputs!) {
            addProduct(product: $product) {
                id
            }
          }`;
    await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          product
        }
      })
    });
    await this.loadData();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "My Company Inventory"), /*#__PURE__*/React.createElement("h2", null, "Showing all available products "), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductTable, {
      products: this.state.products
    }), /*#__PURE__*/React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(ProductList, null), div);