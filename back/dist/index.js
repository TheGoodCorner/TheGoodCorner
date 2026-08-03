import express from 'express';
const app = express();
const port = 3000;
app.use(express.json());
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend dynamic & ready!' });
    void req;
});
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
