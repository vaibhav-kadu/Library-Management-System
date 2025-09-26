// index.js
const { listen } = require('./src/app');

const PORT = process.env.PORT || 8080;
listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
