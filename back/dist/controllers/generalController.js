import multer from 'multer';
// import express dependancies for request handling
void multer;
/**
 * generalController object creation with methods
 */
const generalController = {
    getHomePage: (req, res) => {
        void req;
        res.status(200).json({ status: 'OK', message: 'home page !' });
    },
    getLoginPage: (req, res) => {
        void req;
        res.status(200).json({ status: 'OK', message: 'login page !' });
    },
    getPaiementPage: (req, res) => {
        void req;
        res.status(200).json({ status: 'OK', message: 'payment page !' });
    },
    getMessagesPage: (req, res) => {
        void req;
        res.status(200).json({ status: 'OK', message: 'messages page !' });
    },
    getProfilPage: (req, res) => {
        void req;
        res.status(200).json({ status: 'OK', message: 'profil page !' });
    },
    getProductsPage: (req, res) => {
        void req;
        res.status(200).json({ status: 'OK', message: 'product page !' });
    },
    getSignUpPage: async (req, res) => {
        void req;
        res.status(200).json({ status: 'OK', message: 'signin page !' });
    },
};
export default generalController;
