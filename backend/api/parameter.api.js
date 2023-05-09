const express = require('express');
const router = express.Router();
const {ParameterService} = require('../service');
const parameterService = new ParameterService();

router.get("/", function (req, res) {
    parameterService.findAll().then(result => {
        if (result) res.send(result)
        else res.sendStatus([])
    }).catch(error => {
        console.error(`Erro ao buscar paramters`, error);
        res.sendStatus(500);
    });
});


router.post("/", function (req, res) {
    let parameterToSave = req.body;
    parameterService.save(parameterToSave).then(parameter => {
        if (parameter) res.send(parameter)
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao salvar parameter: ${parameterToSave}`, error);
        res.status(500).send(error.message);
    });
});

router.get("/:parameterName", function (req, res) {
    let parameterName = req.params.parameterName;
    parameterService.findByName(parameterName).then(parameter => {
        if (parameter) res.send(parameter)
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao buscar parameter: ${parameterName}`, error);
        res.sendStatus(500);
    });
});



module.exports = router;