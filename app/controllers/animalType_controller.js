const db = require('../models');
const AnimalType = db.animalType;

exports.findAll = (req, res) => {
    try {
        AnimalType.findAll({
            attributes: ["id", "type"]
        }).then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(400).json({message: err.meassage} || "Something wrong, Can't find animal type data..")});
    } catch(err) {
        console.log(err);
    };
};

exports.findOne = (req, res) => {
    try {

        AnimalType.findByPk(req.params.id, {
            attributes: ["id", "type"]
        })
        .then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(400).json({message: err.meassage || `Something wrong, Can't find animal type id:${req.params.id} data..`});
        });
    } catch(err) {
        res.status(400).json({message: err.meassage});
    };
};

exports.create = (req, res) => {
    try {
        console.log(req.body.type)
        if(!req.body.type) {
            return res.status(400).json({Message: "Data can't empty!"});
        }

        AnimalType.create({type:req.body.type}).then(
            res.status(200).json({message: "Animal type created"})
        ).catch(err => {
            res.status(500).json({message: err.meassage || "Something wrong, Can't create animal type.."});
        }) 
    } catch(err) {
        res.status(400).json({message: err.meassage || "Error 400"});
    }
};

exports.update = (req, res) => {
    try {

        if(!req.body.type) {
            return res.status(400).json({Message: "Data can't empty!"});
        }   

        AnimalType.update({type:req.body.type}, {
            where: { id: req.params.id }
        }).then(
            res.status(200).json({message: "Animal type updated"})
        ).catch(err => {
            res.status(500).json({message: err.meassage || `Something wrong, Can't upadate animal type id:${id}..`});
        })
    } catch(err) {
        res.status(400).json({message: err.meassage});
    }
};

exports.delete = (req, res) => {
    try {
        AnimalType.destroy({
            where: { id:req.params.id }
        }).then(data => {
            if(data == 1) {
                res.status(200).json({message: "Animal type deleted"});
            } else {
                res.status(500).json({message: "Animal type failed"});
            }
        }).catch(err => {
            res.status(500).json({message: err.meassage});
        })
    } catch(err) {
        res.status(400).json({message: err.meassage});
    }
};