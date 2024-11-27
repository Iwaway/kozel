const config = require('../config');
const db = require('../db');
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
const jwt = require('jsonwebtoken');
const Mail = require('../controllers/mail');
const mail = new Mail();

class UserManager{
    async authorization(data){
        const user = await db.getUserByEmail(data.email);
        if(!user) return { status: 'error', message: 'User not found. Maybe you need to register.'};
        const result = this.#verifyPassword(data.password, user.password);
        if(result === null) return { status: 'error', message: 'Error! Try again later.'};
        if(result === false) return { status: 'error', message: 'Incorrect password'};
        const token = this.generateToken({ id: user.id, nickname: user.nickname });
        if(token === null) return { status: 'error', message: 'Error at receiving token.'};
        return {
            status: 'ok',
            data: {
                token: token,
                nickname: user.nickname,
                id: user.id,
            }
        }
    }
    async registration(data){ 
        let emailExists, nicknameExists;
        try{
            [emailExists, nicknameExists] = await Promise
                .all([db.checkEmailExistence(data.email), db.checkNicknameExistence(data.nickname)]);
        }catch(e){
            return { status: 'error', message: 'Error! Try again later.'};
        }
        if(emailExists) return { status: 'error', message: 'This email is already in use'};
        if(nicknameExists) return { status: 'error', message: 'This nickname is already in use.'};
        const hash = await this.#hashPassword(data.password);
        if(hash === null) return { status: 'error', message: 'Error! Try again later.' };
        const number = utils.getRandomeFiveDigitNumber();
        await db.createUser(data.nickname, hash, data.email, number);
        const user = await db.getUserByEmail(data.email);
        if(user === null) return { status: 'error', message: 'Error! Try again later.'};
        const text = `Your confirmation code ${number}`;
        await mail.send(data.email, 'Registration confirmation for Goat Online', text);
        const token = this.generateToken({ id: user.id, nickname: user.nickname });
        if(token === null) return { status: 'error', message: 'Error at receiving token.'};
        return {
            status: 'ok',
            data: {
                token: token,
                nickname: user.nickname,
                id: user.id,
            }
        }
    }
    async activateAccount(data){
        const decoded = this.verifyToken(data.token);
        if(decoded === null) return { status: 'error', message: 'Error! Try again later.' };
        const user = await db.getUserById(decoded.data.id);
        if(user === null) return { status: 'error', message: 'User not found.' };
        if(data.code !== user.activate_code) return { status: 'error', message: 'Incorrect confirmation code.' };
        await db.activateAccount(user.id);
        return { status: 'ok' };
    }
    generateToken(user){
        try{
            const token = jwt.sign({data: user}, config.tokenSecretKey, { expiresIn: '1h' });
            return token;
        }catch(e){
            console.error(e);
            return null;
        }
    }
    verifyToken(token){
        try{
            const user = jwt.verify(token, config.tokenSecretKey);
            return user;
        }catch(e){
            //console.error(e);
            return null;
        }
    }
    async #hashPassword(password){
        try{
            const salt = await bcrypt.genSalt(config.saltRounds);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        }catch(e){
            console.error(e);
            return null;
        }
    }
    async #verifyPassword(password, hash){
        try{    
            const match = await bcrypt.compare(password, hash);
            return match;
        }catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = UserManager;