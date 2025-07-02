document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addProduct').addEventListener('click', addProduct);
    document.getElementById('generateBill').addEventListener('click', generateBill);
    document.getElementById('downloadPDF').addEventListener('click', downloadPDF);
    document.getElementById('editBill').addEventListener('click', editBill);
    document.getElementById('gstRate').addEventListener('input', updateTotalSummary);
    document.getElementById('taxRate').addEventListener('input', updateTotalSummary);

    // Attach event listeners to initial product row
    attachEventListeners(document.querySelector('.product'));
    updateDisplayRates();
});

function addProduct() {
    const productSection = document.getElementById('productSection');
    const newProduct = document.createElement('div');
    newProduct.classList.add('product');
    newProduct.innerHTML = `
        <input type="text" class="productName" placeholder="Product Name" required>
        <input type="number" class="quantity" placeholder="Quantity" min="1" required>
        <input type="number" class="price" placeholder="Price" min="0" step="0.01" required>
        <span class="amount">0.00</span>
    `;
    productSection.appendChild(newProduct);
    attachEventListeners(newProduct);
}

function attachEventListeners(productDiv) {
    const quantityInput = productDiv.querySelector('.quantity');
    const priceInput = productDiv.querySelector('.price');
    
    quantityInput.addEventListener('input', updateAmount);
    priceInput.addEventListener('input', updateAmount);
}

function updateAmount() {
    const productDiv = this.parentNode;
    const quantity = parseFloat(productDiv.querySelector('.quantity').value) || 0;
    const price = parseFloat(productDiv.querySelector('.price').value) || 0;
    const amount = quantity * price;
    
    productDiv.querySelector('.amount').textContent = amount.toFixed(2);
    updateTotalSummary();
}

function updateTotalSummary() {
    let subtotal = 0;
    document.querySelectorAll('.amount').forEach(amount => {
        subtotal += parseFloat(amount.textContent) || 0;
    });

    const gstRate = parseFloat(document.getElementById('gstRate').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;

    const gstAmount = (subtotal * gstRate) / 100;
    const additionalTaxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + gstAmount + additionalTaxAmount;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('gstAmount').textContent = gstAmount.toFixed(2);
    document.getElementById('additionalTaxAmount').textContent = additionalTaxAmount.toFixed(2);
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);

    updateDisplayRates();
}

function updateDisplayRates() {
    document.getElementById('displayGstRate').textContent = document.getElementById('gstRate').value || 0;
    document.getElementById('displayTaxRate').textContent = document.getElementById('taxRate').value || 0;
}

function generateBill() {
    const formData = collectFormData();
    if (!validateForm(formData)) return;
    
    const selectedTemplate = document.getElementById('templateSelect').value;
    let invoiceHTML = '';
    
    switch(selectedTemplate) {
        case 'template1':
            invoiceHTML = generateTemplate1(formData);
            break;
        case 'template2':
            invoiceHTML = generateTemplate2(formData);
            break;
        case 'template3':
            invoiceHTML = generateTemplate3(formData);
            break;
        case 'template4':
            invoiceHTML = generateTemplate4(formData);
            break;
    }
    
    document.getElementById('invoiceContent').innerHTML = invoiceHTML;
    document.getElementById('invoiceSection').style.display = 'block';
    document.getElementById('invoiceSection').scrollIntoView({ behavior: 'smooth' });
}

function collectFormData() {
    const products = [];
    document.querySelectorAll('.product').forEach(product => {
        const name = product.querySelector('.productName').value;
        const quantity = product.querySelector('.quantity').value;
        const price = product.querySelector('.price').value;
        const amount = product.querySelector('.amount').textContent;
        
        if (name && quantity && price) {
            products.push({ name, quantity, price, amount });
        }
    });

    const subtotal = parseFloat(document.getElementById('subtotal').textContent);
    const gstRate = parseFloat(document.getElementById('gstRate').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const gstAmount = parseFloat(document.getElementById('gstAmount').textContent);
    const additionalTaxAmount = parseFloat(document.getElementById('additionalTaxAmount').textContent);
    const totalAmount = parseFloat(document.getElementById('totalAmount').textContent);
    
    return {
        hotelName: document.getElementById('hotelName').value,
        billNo: document.getElementById('billNo').value,
        billDate: document.getElementById('billDate').value,
        billTime: document.getElementById('billTime').value,
        cashier: document.getElementById('Cashier').value,
        hotelAddress: document.getElementById('hotelAddress').value,
        gstin: document.getElementById('gstin').value,
        phone: document.getElementById('phone').value,
        products: products,
        subtotal: subtotal.toFixed(2),
        gstRate: gstRate,
        taxRate: taxRate,
        gstAmount: gstAmount.toFixed(2),
        additionalTaxAmount: additionalTaxAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
    };
}

function validateForm(data) {
    if (!data.hotelName || !data.billNo || !data.billDate || !data.billTime || !data.cashier || !data.hotelAddress) {
        alert('Please fill in all required fields');
        return false;
    }
    
    if (data.products.length === 0) {
        alert('Please add at least one product');
        return false;
    }
    
    const templateSelect = document.getElementById('templateSelect').value;
    if (!templateSelect) {
        alert('Please select an invoice template');
        return false;
    }
    
    return true;
}

function generateTemplate1(data) {
    const productsHTML = data.products.map(product => `
        <div class="item-row">
            <div style="display: flex; justify-content: space-between;">
                    <span>${product.name}</span>
                    <span> ${product.quantity} × ${parseFloat(product.price).toFixed(2)} ₹${parseFloat(product.price*product.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="template1">
            <div class="header">
                <div class="company-name">${data.hotelName}</div>
                <div class="address">${data.hotelAddress.replace(/\n/g, '<br>')}</div>
                ${data.phone ? `<div class="address">TEL: ${data.phone}</div>` : ''}
                ${data.gstin ? `<div class="address">GSTIN: ${data.gstin}</div>` : ''}
            </div>
            
            <div class="separator">
                EXPERIENCE THE JOY OF BILLING
            </div>
            
            <div class="bill-details">
                <div>DATE: ${data.billDate}</div>
                <div>BILL NO: ${data.billNo} TIME: ${data.billTime}</div>
                <div>CASHIER: ${data.cashier}</div>
            </div>
            
            <div class="items-header">
                <div style="display: flex; justify-content: space-between;">
                    <span>ITEM</span>
                    <span>QTY PRICE AMOUNT</span>
                </div>
            </div>
            
            ${productsHTML}
            
            <div class="totals">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>TOTAL ITMS: ${data.products.length}</span>
                    <span>/QTY: ${data.products.reduce((sum, p) => sum + parseInt(p.quantity), 0)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>TOTAL AMOUNT:</span>
                    <span>₹${data.subtotal}</span>
                </div>
                ${data.gstRate > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>TAX % TAXBL VAL CGST SGST</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>${data.gstRate}% ${data.subtotal} ${(parseFloat(data.gstAmount)/2).toFixed(2)} ${(parseFloat(data.gstAmount)/2).toFixed(2)}</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px dashed #000; padding-top: 2px;">
                    <span>TOTAL</span>
                    <span>₹${data.totalAmount}</span>
                </div>
            </div>
            
            <div class="footer">
                THANKS VISIT AGAIN
            </div>
        </div>
    `;
}

function generateTemplate2(data) {
    const productsHTML = data.products.map(product => `
        <div class="item-line">
            <span>-${product.quantity} ${product.name}</span>
            <span>${product.amount}</span>
        </div>
    `).join('');
    
    return `
        <div class="template2">
            <div class="header">
                <div class="company-name">${data.hotelName}</div>
                <div class="address">${data.hotelAddress.replace(/\n/g, '<br>')}</div>
                ${data.phone ? `<div>TEL: ${data.phone}</div>` : ''}
            </div>
            
            <div class="ticket-label">
                T i c k e t
            </div>
            
            <div class="table-info">
                <span>Table: 2</span>
                <span>RECEIPT#: ${data.billNo}</span>
            </div>
            
            <div style="border-bottom: 1px dashed #000; margin-bottom: 8px;"></div>
            
            <div class="items">
                ${productsHTML}
            </div>
            
            <div style="border-bottom: 1px solid #000; margin: 8px 0;"></div>
            
            <div class="totals">
                ${data.gstRate > 0 ? `
                <div class="total-line">
                    <span>VAT ${data.gstRate}%:</span>
                    <span>${data.gstAmount}</span>
                </div>` : ''}
                ${data.taxRate > 0 ? `
                <div class="total-line">
                    <span>CTL ${data.taxRate}%:</span>
                    <span>${data.additionalTaxAmount}</span>
                </div>` : ''}
                <div style="border-bottom: 1px dashed #000; margin: 4px 0;"></div>
                <div class="total-line grand-total">
                    <span>GRAND TOTAL:</span>
                    <span>${data.totalAmount}</span>
                </div>
                <div class="total-line">
                    <span>PAID BY: Cash</span>
                    <span>₹${data.totalAmount}</span>
                </div>
                <div class="total-line">
                    <span>CHANGE:</span>
                    <span>0.00</span>
                </div>
            </div>
            
            <div style="border-bottom: 1px solid #000; margin: 8px 0;"></div>
            
            <div style="text-align: center; font-size: 7px;">
                <div>STAFF NAME: ${data.cashier}</div>
                <div>Date: ${data.billDate} Time: ${data.billTime}</div>
            </div>
        </div>
    `;
}

function generateTemplate3(data) {
    const productsHTML = data.products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td style="text-align: center;">${product.quantity}</td>
            <td style="text-align: right;">${product.amount}</td>
        </tr>
    `).join('');
    
    return `
        <div class="template3">
            <div class="header">
                <div class="company-name">${data.hotelName}</div>
                <div class="address">${data.hotelAddress.replace(/\n/g, '<br>')}</div>
                ${data.phone ? `<div>PHONE: ${data.phone}</div>` : ''}
                ${data.gstin ? `<div>GSTIN: ${data.gstin}</div>` : ''}
                
                <div class="invoice-title">Retail Invoice</div>
            </div>
            
            <div class="bill-info">
                <div>Date: ${data.billDate}, ${data.billTime}</div>
                <div>${data.cashier}</div>
                <div>Bill No: ${data.billNo}</div>
                <div>Payment Mode: Cash</div>
                <div>DR Ref: 2</div>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Amt</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsHTML}
                </tbody>
            </table>
            
            <div class="totals">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Sub Total</span>
                    <span>${data.subtotal}</span>
                </div>
                <div style="margin: 4px 0; font-size: 7px;">
                    <div>(-) Discount: 0.00</div>
                    ${data.gstRate > 0 ? `<div>CGST @ ${data.gstRate/2}%: ${(parseFloat(data.gstAmount)/2).toFixed(2)}</div>` : ''}
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #000; padding-top: 2px;">
                    <span>TOTAL</span>
                    <span>Rs ${data.totalAmount}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                    <span>Cash:</span>
                    <span>Rs ${data.totalAmount}</span>
                </div>
            </div>
        </div>
    `;
}

function generateTemplate4(data) {
    const productsHTML = data.products.map(product => `
        <div class="item">
            <div class="item-name">${product.name}</div>
            <div class="item-details">
                <span>${product.quantity} × ₹${parseFloat(product.price).toFixed(2)}</span>
                <span>₹${product.amount}</span>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="template4">
            <div class="header">
                <div class="company-name">${data.hotelName}</div>
                <div class="address">${data.hotelAddress.replace(/\n/g, '<br>')}</div>
                ${data.phone ? `<div>Phone: ${data.phone}</div>` : ''}
                ${data.gstin ? `<div>GSTIN: ${data.gstin}</div>` : ''}
            </div>
            
            <div class="bill-details">
                <div>Bill: ${data.billNo} | Date: ${data.billDate}</div>
                <div>Time: ${data.billTime} | Cashier: ${data.cashier}</div>
            </div>
            
            <div class="items">
                ${productsHTML}
            </div>
            
            <div class="totals">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Subtotal:</span>
                    <span>₹${data.subtotal}</span>
                </div>
                ${data.gstRate > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>GST (${data.gstRate}%):</span>
                    <span>₹${data.gstAmount}</span>
                </div>` : ''}
                ${data.taxRate > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Tax (${data.taxRate}%):</span>
                    <span>₹${data.additionalTaxAmount}</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #000; padding-top: 2px;">
                    <span>TOTAL:</span>
                    <span>₹${data.totalAmount}</span>
                </div>
            </div>
        </div>
    `;
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const invoiceElement = document.getElementById('invoiceContent');

    if (!invoiceElement) {
        alert('No invoice content found. Please generate the bill first.');
        return;
    }

    if (invoiceElement.style.display === 'none' || !invoiceElement.innerHTML.trim()) {
        alert('Invoice content is not visible or empty. Please generate the bill first.');
        return;
    }

    html2canvas(invoiceElement, {
        scale: 2,                // higher scale = better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: invoiceElement.scrollWidth,
        height: invoiceElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        x: -5,
        y: 0
        
    }).then(canvas => {
        if (canvas.width === 0 || canvas.height === 0) {
            alert('Failed to capture invoice content. Please try again.');
            return;
        }

        const imgData = canvas.toDataURL('image/png', 1.0);

        if (imgData === 'data:,' || imgData.length < 100) {
            alert('Failed to generate image from invoice. Please try again.');
            return;
        }

        const maxPdfWidth = 80; // maximum width in mm
        const imgWidth = Math.min(maxPdfWidth, canvas.width * 0.264583); // px to mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const margin = 5; // margin in mm

        const pdfWidth = imgWidth + 2 * margin;
        const pdfHeight = imgHeight + 2 * margin;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [pdfWidth, Math.max(100, pdfHeight)]
        });

        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, '', 'FAST');

        const billNo = document.getElementById('billNo')?.value || 'receipt';
        pdf.save(`${billNo}_receipt.pdf`);
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    });
}

function editBill() {
    document.getElementById('invoiceSection').style.display = 'none';
    document.getElementById('billForm').scrollIntoView({ behavior: 'smooth' });
}
