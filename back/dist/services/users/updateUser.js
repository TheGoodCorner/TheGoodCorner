import { hashIt } from '../../utils/securityUtils.js';
export const userUpdate = ({ body, file }) => {
    const data = {};
    const sellerEliteStatusCatchPass = 'GoodCornerBigBoss';
    if (body.email !== undefined) {
        const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'laposte.net'];
        const domain = body.email.split('@')[1];
        if (domain && !allowedDomains.includes(domain.toLowerCase()))
            throw new Error('email invalide !');
        data.email = String(body.email);
    }
    if (body.username !== undefined)
        data.username = String(body.username);
    if (body.password !== undefined)
        data.password = String(body.password);
    if (body.name !== undefined)
        data.name = String(body.name);
    if (body.bio !== undefined)
        data.bio = String(body.bio);
    if (body.phoneNumber !== undefined) {
        if (body.phoneNumber === null || body.phoneNumber === '') {
            data.phoneNumber = null;
        }
        else {
            const sanitizedPhone = String(body.phoneNumber).replace(/\D/g, '');
            if (sanitizedPhone.length !== 10)
                throw new Error('Numéro de téléphone invalide (10 chiffres requis).');
            data.phoneNumber = sanitizedPhone;
        }
    }
    if (body.sellerEliteStatusCatchPhrase !== undefined) {
        if (body.sellerEliteStatusCatchPhrase === sellerEliteStatusCatchPass && body.sellerEliteStatus === false)
            data.sellerEliteStatus = true;
        data.sellerEliteStatusCatchPhrase = hashIt(body.sellerEliteStatusCatchPhrase);
    }
    if (body.location !== undefined) {
        const loc = body.location;
        const locPayload = {
            country: loc.country,
            region: loc.region,
            city: loc.city,
            street: loc.street,
            houseNumber: loc.house_number,
            additionnalInfos: loc.additionnal_infos ? loc.additionnal_infos : undefined
        };
        data.location = {
            upsert: {
                create: locPayload,
                update: locPayload
            }
        };
    }
    if (file)
        data.avatar = `/uploads/${file.filename}`;
    return data;
};
