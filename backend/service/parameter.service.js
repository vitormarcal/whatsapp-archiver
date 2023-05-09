const { Parameter } = require('../models');
const fs = require("fs");
const {where} = require("sequelize");

class ParameterService {
    constructor() {


    }

    findByName = async name => Parameter.findOne({
        where: {name: name}
    });

    findAll = async () => Parameter.findAndCountAll();


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