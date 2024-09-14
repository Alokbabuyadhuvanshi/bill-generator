document.getElementById('addProduct').addEventListener('click', addProduct);
document.getElementById('generateBill').addEventListener('click', generateBill);

// Function to add a new product input row
function addProduct() {
    const productSection = document.getElementById('productSection');
    const newProduct = document.createElement('div');
    newProduct.classList.add('product');
    newProduct.innerHTML = `
        <input type="text" class="productName" placeholder="Product Name" required>
        <input type="number" class="quantity" placeholder="Quantity" min="1" required>
        <input type="number" class="price" placeholder="Price" min="0" required>
        <span class="amount">0.00</span>
    `;
    productSection.appendChild(newProduct);

    // Attach event listeners to the new product row
    attachEventListeners(newProduct);
}

// Function to attach event listeners for quantity and price inputs
function attachEventListeners(productDiv) {
    const quantityInput = productDiv.querySelector('.quantity');
    const priceInput = productDiv.querySelector('.price');

    // Add event listeners for input changes
    quantityInput.addEventListener('input', updateAmount);
    priceInput.addEventListener('input', updateAmount);
}

// Function to update the amount for a single product
function updateAmount() {
    const productDiv = this.parentNode;
    const quantity = parseFloat(productDiv.querySelector('.quantity').value);
    const price = parseFloat(productDiv.querySelector('.price').value);
    
    // Calculate the amount and handle NaN cases
    const amount = isNaN(quantity) || isNaN(price) ? 0 : quantity * price;
    productDiv.querySelector('.amount').textContent = amount.toFixed(2);

    // Update the total amount
    updateTotal();
}

// Function to update the total amount
function updateTotal() {
    let total = 0;

    // Sum all product amounts
    document.querySelectorAll('.amount').forEach(amount => {
        total += parseFloat(amount.textContent);
    });

    // Display the total amount
    document.getElementById('totalAmount').textContent = total.toFixed(2);
}

// Function to generate and display the bill receipt
function generateBill() {
    const hotelName = document.getElementById('hotelName').value;
    const billNo = document.getElementById('billNo').value;
    const billDate = document.getElementById('billDate').value;
    const billTime = document.getElementById('billTime').value;
    const Cashier = document.getElementById('Cashier').value;
    const hotelAddress = document.getElementById('hotelAddress').value;

    // Create the receipt content
    let receipt = `<div class="bill">
                            <h5>RETAIL INVOICE</h5>
                            <h2>${hotelName}</h2>
                            <h4>${hotelAddress}</h4><hr>
                        <span><strong>Bill No:</strong>${billNo}</span>
                        <span><strong>Date:</strong>${billDate}</span>
                        <span><strong>Cashier:</strong>${Cashier}</span>
                        <span class="time"><strong>Time:</strong>${billTime}</span><hr>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                    </div>
    `;

    // Loop through each product and add to receipt
    document.querySelectorAll('.product').forEach(product => {
        const productName = product.querySelector('.productName').value;
        const quantity = product.querySelector('.quantity').value;
        const price = product.querySelector('.price').value;
        const amount = product.querySelector('.amount').textContent;

        receipt += `
            <tr>
                <td>${productName}</td>
                <td>${quantity}</td>
                <td>${price}</td>
                <td>${amount}</td>
            </tr>
        `;
    });

    // Add the total amount to the receipt
    receipt += `
            <tr class="total">
                <td colspan="3">Total</td>
                <td>${document.getElementById('totalAmount').textContent}</td>
            </tr>
        </tbody>
        </table>
    `;

    // Display the receipt
    document.getElementById('receipt').innerHTML = receipt;
}

// Attach initial event listeners to the first product section
attachEventListeners(document.querySelector('.product'));
