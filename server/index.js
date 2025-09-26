// index.js
import { listen } from './src/app';

const PORT = process.env.PORT || 8080;
listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
