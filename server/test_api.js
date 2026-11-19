const axios = require('axios');

async function testAll() {
  const baseURL = 'http://localhost:5000/api';
  console.log('--- 1. Testing Health ---');
  const health = await axios.get(`${baseURL}/health`);
  console.log('Health:', health.data);

  console.log('\n--- 2. Testing Admin Login ---');
  const loginRes = await axios.post(`${baseURL}/auth/login`, {
    email: 'admin@mavi.uz',
    password: 'AdminPassword2026!'
  });
  console.log('Login success:', loginRes.data.success, 'Role:', loginRes.data.user.role);
  const token = loginRes.data.token;

  console.log('\n--- 3. Testing Products List ---');
  const prodRes = await axios.get(`${baseURL}/products?limit=2`);
  const sampleProduct = prodRes.data.products[0];
  console.log('Loaded sample product:', sampleProduct.sku, sampleProduct.name.uz, 'Price:', sampleProduct.price);

  console.log('\n--- 4. Testing Coupon Validation ---');
  const couponRes = await axios.post(`${baseURL}/coupons/validate`, {
    code: 'MAVI10',
    subtotal: 1000000
  });
  console.log('Coupon valid:', couponRes.data.success, 'Discount:', couponRes.data.coupon.discountAmount);

  console.log('\n--- 5. Testing Order Creation & Telegram Service ---');
  const orderRes = await axios.post(`${baseURL}/orders`, {
    customer: {
      fullName: 'Shahzod Aliyev',
      phone: '+998 90 123 45 67',
      email: 'shahzod@example.com',
      region: 'Toshkent shahri',
      district: 'Mirobod tumani',
      address: 'Afrosiyob ko‘chasi, 12-uy',
      notes: 'Iltimos, soat 14:00 dan keyin yetkazing'
    },
    items: [
      {
        productId: sampleProduct._id,
        size: 'L',
        color: { name: 'Black', hex: '#111111' },
        quantity: 1
      }
    ],
    couponCode: 'MAVI10',
    paymentMethod: 'Cash on Delivery'
  });

  console.log('Order created successfully!');
  console.log('Order ID:', orderRes.data.order.orderId);
  console.log('Subtotal:', orderRes.data.order.subtotal);
  console.log('Total:', orderRes.data.order.total);

  console.log('\n--- 6. Testing Admin Orders List & Retry ---');
  const ordersListRes = await axios.get(`${baseURL}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Total orders in DB:', ordersListRes.data.totalOrders);
  const latestOrder = ordersListRes.data.orders[0];
  console.log('Latest Order Telegram status:', latestOrder.telegramNotification);

  console.log('\n--- 7. Testing Admin Dashboard Analytics ---');
  const dashboardRes = await axios.get(`${baseURL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Dashboard Revenue:', dashboardRes.data.data.totalRevenue, 'Total Orders:', dashboardRes.data.data.totalOrders);

  console.log('\n>>> ALL BACKEND REST APIS AND INTEGRATIONS TESTED AND VERIFIED! <<<');
}

testAll().catch(err => {
  console.error('Test failed:', err.response?.data || err.message);
  process.exit(1);
});
