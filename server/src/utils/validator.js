const validator = require('validator');

const authValidate = (data) =>{
    if(typeof data !== 'object') return { message: 'Invalid data.'};
    //email
    if(!data.email) return { message: 'Email cannot be null.'};
    if(!validator.isEmail(data.email)) return { message: 'Incorrect email.'};
    //password
    if(!data.password) return { message: 'Password cannot be null.'};
    if(!validator.isLength(data.password, { min: 8, max: 30 })) return { message: 'Password must be 8 to 30 characters.'};
    //answer
    if(!data.answer) return { message: 'Enter the captcha answer.' };
    //captcha id 
    if(!data.captchaId) return { message: 'Captcha error.' };
    return false;
}

const registerValidate = (data) =>{
    if(typeof data !== 'object') return { message: 'Invalid data.'};
    //email
    if(!data.email) return { message: 'Email cannot be null.'};
    if(!validator.isEmail(data.email)) return { message: 'Incorrect email.'};
    //password
    if(!data.password) return { message: 'Password cannot be null.'};
    if(!validator.isLength(data.password, { min: 8, max: 30 })) return { message: 'Password must be 8 to 30 characters.'};
    //nickname
    if(!data.nickname) return { message: 'Nickname cannot be null.'};
    if(!validator.isLength(data.nickname, { min: 3, max: 30 })) return { message: 'Password must be 8 to 30 characters.'};
    //answer
    if(!data.answer) return { message: 'Enter the captcha answer.' };
    //captcha id 
    if(!data.captchaId) return { message: 'Captcha error.' };
    return false;
}

const activateAccountValidate = (data) =>{
    if(typeof data !== 'object') return { message: 'Invalid data.'};
    //token
    if(!data.token) return { message: 'Please, login to your account.'};
    if(!validator.isJWT(data.token)) return { message: 'Please, login to your account.' };
    //code
    if(!data.code) return { message: 'Confirmation code cannot be null.'};
    return false;
}

const chatMessageValidate = (data) => {

}

module.exports = { authValidate, registerValidate, activateAccountValidate, chatMessageValidate };