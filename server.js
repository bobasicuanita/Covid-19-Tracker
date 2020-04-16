import { app } from './app.js';

// Server port
const port = process.env.PORT || 3000;

// Server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
