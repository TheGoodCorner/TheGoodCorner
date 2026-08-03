// import express dependancies for request handling
/**
 * controller object creation with methods
 */
const controller = {
    getHomePage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'home page !' });
    },
    getLoginPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'login page !' });
    },
    getPaiementPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'payment page !' });
    },
    getMessagesPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'messages page !' });
    },
    getProfilPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'profil page !' });
    }
};
export default controller;
