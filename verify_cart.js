const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8080/api/cart';

async function verifyCart() {
    try {
        console.log('--- START VERIFICATION ---');

        // 1. GET Cart
        console.log('1. Getting Cart...');
        let res = await fetch(BASE_URL);
        let cart = await res.json();
        console.log('Initial Cart:', JSON.stringify(cart, null, 2));

        // 2. Add Item (Product ID 1 - Ensure existing product)
        // If DB is empty, this might fail on FK constraint if product 1 doesn't exist.
        // Assuming Product 1 exists or using a dummy. Since I can't guarantee Product 1 exists, 
        // I might need to create it or pick a valid one.
        // For now, I'll try ID 1. If it fails, I'll inspect.
        console.log('2. Adding Item (Product 1)...');
        res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: 1, quantity: 2 })
        });
        let added = await res.json();
        console.log('Added:', added);

        if (!res.ok) {
            console.error('Failed to add item. Exiting.');
            return;
        }

        // 3. Get Cart Again
        console.log('3. Getting Cart after Add...');
        res = await fetch(BASE_URL);
        cart = await res.json();
        console.log('Cart after Add:', JSON.stringify(cart, null, 2));

        let newItem = cart.items.find(i => i.productId === 1);
        if (!newItem) {
            console.error('Item not found in cart!');
        } else {
            console.log('Item found with quantity:', newItem.quantity);

            // 4. Update Quantity
            console.log('4. Updating Quantity to 5...');
            res = await fetch(`${BASE_URL}/items/${newItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: 5 })
            });
            console.log('Update Result:', await res.json());

            // 5. Delete Item
            console.log('5. Deleting Item...');
            res = await fetch(`${BASE_URL}/items/${newItem.id}`, {
                method: 'DELETE'
            });
            console.log('Delete Result:', await res.json());
        }

        console.log('--- VERIFICATION COMPLETE ---');

    } catch (error) {
        console.error('Verification Failed:', error);
    }
}

verifyCart();
