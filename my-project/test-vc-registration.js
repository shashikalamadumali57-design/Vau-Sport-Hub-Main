// Test script for Vice Captain registration
// This script tests the registration endpoint with a Vice Captain role

const axios = require('axios');

const API_URL = 'http://localhost:8080/api/auth';

async function testViceCaptainRegistration() {
    console.log('=== Testing Vice Captain Registration ===\n');

    // Test 1: Try to register with an existing username (should fail)
    console.log('Test 1: Registering with existing username "admin"...');
    try {
        await axios.post(`${API_URL}/signup`, {
            username: 'admin',
            email: 'newadmin@test.com',
            password: 'password123',
            role: 'ROLE_VICE_CAPTAIN'
        });
        console.log('❌ FAILED: Should have rejected existing username\n');
    } catch (error) {
        console.log('✅ PASSED: ' + error.response?.data?.message);
        console.log('');
    }

    // Test 2: Try to register with an existing email (should fail)
    console.log('Test 2: Registering with existing email "admin@vav.com"...');
    try {
        await axios.post(`${API_URL}/signup`, {
            username: 'newadmin',
            email: 'admin@vav.com',
            password: 'password123',
            role: 'ROLE_VICE_CAPTAIN'
        });
        console.log('❌ FAILED: Should have rejected existing email\n');
    } catch (error) {
        console.log('✅ PASSED: ' + error.response?.data?.message);
        console.log('');
    }

    // Test 3: Register a new Vice Captain (should succeed)
    console.log('Test 3: Registering new Vice Captain...');
    const timestamp = Date.now();
    const username = `vicecaptain_${timestamp}`;
    const email = `vc_${timestamp}@test.com`;

    try {
        const response = await axios.post(`${API_URL}/signup`, {
            username: username,
            email: email,
            password: 'password123',
            role: 'ROLE_VICE_CAPTAIN'
        });
        console.log('✅ PASSED: ' + response.data.message);
        console.log(`   Username: ${username}`);
        console.log(`   Email: ${email}`);
        console.log('');

        // Test 4: Try to login with the new Vice Captain account
        console.log('Test 4: Logging in with new Vice Captain account...');
        try {
            const loginResponse = await axios.post(`${API_URL}/signin`, {
                username: username,
                password: 'password123'
            });
            console.log('✅ PASSED: Login successful!');
            console.log(`   User ID: ${loginResponse.data.id}`);
            console.log(`   Username: ${loginResponse.data.username}`);
            console.log(`   Email: ${loginResponse.data.email}`);
            console.log(`   Roles: ${loginResponse.data.roles.join(', ')}`);
            console.log(`   Token: ${loginResponse.data.accessToken.substring(0, 20)}...`);
            console.log('');
        } catch (error) {
            console.log('❌ FAILED: Login failed - ' + error.response?.data?.message);
            console.log('');
        }
    } catch (error) {
        console.log('❌ FAILED: ' + error.response?.data?.message);
        console.log('');
    }

    console.log('=== Test Complete ===');
}

// Run the tests
testViceCaptainRegistration().catch(error => {
    console.error('Test script error:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error('\n⚠️  Make sure the backend server is running on http://localhost:8080');
    }
});
