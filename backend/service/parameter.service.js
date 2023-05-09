const { Parameter } = require('../models');
const fs = require("fs");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 });
const {where} = require("sequelize");

class ParameterService {
    constructor() {


    }

    findByName = async name => {
        const cacheKey = `findByName_${name}`;
        const cacheResult = cache.get(cacheKey);
        if (cacheResult) {
            console.log('Retornando resultado do cache.');
            return cacheResult;
        }
        return Parameter.findOne({
            where: {name: name}
        }).then(it => {
            cache.set(cacheKey, it);
            return it
        });
    };
    findAll = async () => {
        const cacheKey = `findAll`;
        const cacheResult = cache.get(cacheKey);
        if (cacheResult) {
            console.log('Retornando resultado do cache.');
            return cacheResult;
        }
        return Parameter.findAndCountAll().then(it => {
            cache.set(cacheKey, it)
            return it
        });
    };


    save = async (payload) => {
        return this.findByName(payload.name).then(founded => {
            if (founded) throw new Error(`${payload.name} already exists`)
            return Parameter.create(payload);
        })
    };
}


module.exports = {
    ParameterService: ParameterService
}