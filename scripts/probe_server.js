const http = require('http');

const url = 'http://localhost:8080/images/blog/dac-nhan-tam.jpg';

console.log(`Checking URL: ${url}`);

http.get(url, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Content-Length: ${res.headers['content-length']}`);

    // Consume response to free memory
    res.resume();
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
