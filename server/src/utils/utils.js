const utils = {
    extractJsonData: (dataString) =>{
        try{
            const data = JSON.parse(dataString);
            return data;
        }catch(e){
            console.log(e);
            return null;
        }
    },
    getLobbyId: () => {
        const uid =  Math.random().toString(36).substring(2).toUpperCase();
        console.log(uid);
        return uid;
    },
    isEmpty: (obj) => {
        return Object.keys(obj).length === 0;
    },
}

module.exports = utils;