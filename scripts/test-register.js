const fetch = require('node-fetch');

async function testRegister() {
    const timestamp = Date.now();
    const user = {
        name: `Script User ${timestamp}`,
        email: `script_${timestamp}@fixia.app`,
        phone: `${timestamp}`.slice(-10),
        password: "Password123",
        role: "CLIENT"
    };

    console.log("Attempting to register:", user);

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const text = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${text}`);

        if (response.ok) {
            console.log("✅ Registration Successful via Script");
        } else {
            console.error("❌ Registration Failed via Script");
        }
    } catch (error) {
        console.error("❌ Network Error:", error);
    }
}

testRegister();
