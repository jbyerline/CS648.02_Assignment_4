const div = document.getElementById('data');

function ProductTable(props) {
    const productRows = props.products.map((product) => {
        return (
            <ProductRow
                key={product.id} product={product}/>
        )
    });

    return (
        <table width="100%">
            <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>ImageURL</th>
            </tr>
            </thead>
            <tbody>
            {productRows}
            </tbody>
        </table>
    );
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
            productImageUrl: form.productImageUrl.value,
        }
        this.props.createProduct(product);
        form.productName.value = "";
        form.productPrice.value = "$";
        form.productCategory.value = "";
        form.productImageUrl.value = "";
    }

    render() {
        return (
            <form name="addProduct" onSubmit={this.handleSubmit}>
                <h2>Add a new product to inventory</h2>
                <hr/>
                <div id="content">
                    <div id="left" align="left">
                        <div>
                            <p>Category</p>
                            <select id="list" name="productCategory">
                                <option value="Shirts">Shirts</option>
                                <option value="Jeans">Jeans</option>
                                <option value="Jackets">Jackets</option>
                                <option value="Sweaters">Sweaters</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>
                        <div>
                            <p>Price Per Unit</p>
                            <input type="text" name="productPrice" defaultValue="$"/>
                        </div>
                        <div>
                            <br/>
                            <button>Add Product</button>
                        </div>
                    </div>
                    <div id="right">
                        <div>
                            <p>Product Name</p>
                            <input type="text" name="productName"/>
                        </div>
                        <div>
                            <p>Image URL</p>
                            <input type="text" name="productImageUrl"/>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

function ProductRow(props) {
    const product = props.product;
    return (
        <tr>
            <td>{product.productName}</td>
            <td>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(product.productPrice)}</td>
            <td>{product.productCategory}</td>
            <td><a href={product.productImageUrl} target="_blank" rel="noreferrer">View</a></td>
        </tr>
    );

}

class ProductList extends React.Component {
    constructor() {
        super();
        this.state = {products: [],};
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query})
        });

        const body = await response.text();
        const result = JSON.parse(body);
        this.setState({products: result.data.productList});
    }

    async createProduct(product) {
        const query = `mutation addProduct($product: ProductInputs!) {
            addProduct(product: $product) {
                id
            }
          }`;

        await fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query, variables: {product}})
        });

        await this.loadData();
    }

    render() {
        return (
            <div>
                <h1>My Company Inventory</h1>
                <h2>Showing all available products </h2>
                <hr/>
                <ProductTable products={this.state.products}/>
                <ProductAdd createProduct={this.createProduct}/>
            </div>
        );
    }
}


ReactDOM.render(<ProductList/>, div);
