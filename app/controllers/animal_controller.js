const db = require('../models');
const Animal = db.animal;
const AnimalType = db.animalType;
const Description = db.description;

exports.findAll = (req, res) => {
    try {
        Animal.findAll({
            attributes: ["id", "animalName", "image"],
            include: [{
                model: AnimalType,
                attributes: ["type"]
            },{
                model: Description,
                attributes: ["behavior", "hobitat", "breeding", "conservation"]
            }
        ]
        }).then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(400).json({message: err.meassage} || "Something wrong, Can't find animal data..")});
    } catch(err) {
        console.log(err);
    };
};

exports.findOne = (req, res) => {
    try {

        Animal.findByPk(req.params.id, {
            attributes: ["id", "animalName", "image"],
            include: [{
                model: AnimalType,
                attributes: ["type"]
            },{
                model: Description,
                attributes: ["behavior", "hobitat", "breeding", "conservation"]
            }
        ]
        })
        .then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(400).json({message: err.meassage || `Something wrong, Can't find animal id:${req.params.id} data..`});
        });
    } catch(err) {
        res.status(400).json({message: err.meassage});
    };
};

// exports.create = (req, res) => {
//     try {

//         if(!req.body.animalName && !req.body.animalTypeId) {
//             return res.status(400).json({Message: "Data can't empty!"});
//         }

//         const animalmObj = {
//             animalName: req.body.animalName,
//             image: req.body.image,
//             animalTypeId: req.body.animalTypeId
//         }

//         const descriptionObj = {
//             behavior: req.body.behavior,
//             hobitat: req.body.hobitat,
//             breeding: req.body.breeding,
//             conservation: req.body.conservation
//         }

//         Animal.create(animalmObj).then((data) => {
//             Description.create(descriptionObj, {animalId: data.id}).then(
//                 res.status(200).json({message: "Description created and joined"})
//             )
//             res.status(200).json({message: "Animal created"})
//         }).catch(err => {
//             res.status(500).json({message: err.meassage || "Something wrong, Can't create animal.."});
//             res.json({data})
//         })  
//     } catch(err) {
//         res.status(400).json({message: err.meassage || "Error 400"});
//     }
// };

exports.create = (req, res) => {
    try {
        if (!req.body.animalName || !req.body.animalTypeId) {
            return res.status(400).json({ message: "Data can't be empty!" });
        }

        const animalObj = {
            animalName: req.body.animalName,
            image: req.body.image,
            animalTypeId: req.body.animalTypeId
        };

        const descriptionObj = {
            behavior: req.body.behavior,
            hobitat: req.body.hobitat,
            breeding: req.body.breeding,
            conservation: req.body.conservation,
        };

        Animal.create(animalObj).then(data => {
            descriptionObj.animalId = data.id;
            return Description.create(descriptionObj);
        }).then(() => {
            res.status(200).json({ message: "Animal and description created successfully" });
        }).catch(err => {
            res.status(500).json({ message: err.message || "Something went wrong, can't create animal or description." });
        });
    } catch (err) {
        res.status(400).json({ message: err.message || "Bad Request" });
    }
};


// exports.update = (req, res) => {
//     try {

//         if(!req.body.animalTypeId) {
//             return res.status(400).json({Message: "Data can't empty!"});
//         }   

//         const animalmObj = {
//             animalName: req.body.animalName,
//             animalTypeId: req.body.animalTypeId
//         }

//         const descriptionObj = {
//             behavior: req.body.behavior,
//             hobitat: req.body.hobitat,
//             breeding: req.body.breeding,
//             conservation: req.body.conservation
//         }

//         Animal.update(animalmObj, {
//             where: { id: req.params.id }
//         }).then((data) => {
//             return Description.update(descriptionObj, {
//                 where: {animalId: req.body.params}
//             })
//             res.status(200).json({message: "Animal updated"})
//         }).catch(err => {
//             res.status(500).json({message: err.meassage || `Something wrong, Can't upadate Animal id:${id}..`});
//         })
//     } catch(err) {
//         res.status(400).json({message: err.meassage});
//     }
// };

exports.update = (req, res) => {
    try {
        // Check if the required fields are present
        if (!req.body.animalTypeId || !req.params.id) {
            return res.status(400).json({ message: "Data can't be empty!" });
        }

        const animalObj = {
            animalName: req.body.animalName,
            image: req.body.image,
            animalTypeId: req.body.animalTypeId
        };

        const descriptionObj = {
            behavior: req.body.behavior,
            habitat: req.body.habitat,
            breeding: req.body.breeding,
            conservation: req.body.conservation
        };

        Animal.update(animalObj, {
            where: { id: req.params.id }
        }).then(() => {
            return Description.update(descriptionObj, {
                where: { animalId: req.params.id }
            });
        }).then(() => {
            res.status(200).json({ message: "Animal and description updated successfully" });
        }).catch(err => {
            res.status(500).json({ message: err.message || `Something went wrong, can't update animal id: ${req.params.id}` });
        });
    } catch (err) {
        res.status(400).json({ message: err.message || "Bad Request" });
    }
};

exports.delete = (req, res) => {
    try {
        Animal.destroy({
            where: { id:req.params.id }
        }).then(data => {
            if(data == 1) {
                res.status(200).json({message: "Animal deleted"});
            } else {
                res.status(500).json({message: "Animal failed"});
            }
        }).catch(err => {
            res.status(500).json({message: err.meassage});
        })
    } catch(err) {
        res.status(400).json({message: err.meassage});
    }
};