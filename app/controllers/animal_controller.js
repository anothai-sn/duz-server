const db = require('../models');
const Animal = db.animal;
const AnimalType = db.animalType;
const upload = require('../middlewere/upload'); // ตรวจสอบให้แน่ใจว่าเส้นทางนี้ถูกต้อง
const multer = require('multer');

exports.findAll = (req, res) => {
    try {
        Animal.findAll({
            attributes: ["id", "animalName", "behavior", "habitat", "reproduction", "diet", "conservation", "image", "imageName"],
            include: [{
                model: AnimalType,
                attributes: ["type"]
            }]
        }).then((data) => {
            const animalsWithBase64Image = data.map(animal => {
                const imageBase64 = animal.image ? `data:image/jpeg;base64,${animal.image.toString('base64')}` : null;
                return {
                    id: animal.id,
                    animalName: animal.animalName,
                    behavior: animal.behavior,
                    habitat: animal.habitat,
                    reproduction: animal.reproduction,
                    diet: animal.diet,
                    conservation: animal.conservation,
                    image: imageBase64,
                    imageName: animal.imageName, 
                    animalType: animal.animalType.type // ส่งเฉพาะ type จาก AnimalType
                };
            });
            res.status(200).json(animalsWithBase64Image);
        }).catch((err) => {
            res.status(400).json({ message: err.message || "Something went wrong, Can't find animal data.." });
        });
    } catch (err) {
        console.error(err); // แสดงข้อผิดพลาดในคอนโซล
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.findOne = (req, res) => {
    try {
        Animal.findByPk(req.params.id, {
            attributes: ["id", "animalName", "behavior", "habitat", "reproduction", "diet", "conservation", "image", "imageName"],
            include: [{
                model: AnimalType,
                attributes: ["type"]
            }]
        }).then((data) => {
            if (!data) {
                return res.status(404).json({ message: `Animal id:${req.params.id} not found` });
            }
            const imageBase64 = data.image ? `data:image/jpeg;base64,${data.image.toString('base64')}` : null;
            res.status(200).json({
                id: data.id,
                animalName: data.animalName,
                behavior: data.behavior,
                habitat: data.habitat,
                reproduction: data.reproduction,
                diet: data.diet,
                conservation: data.conservation,
                image: imageBase64, // แปลง Buffer เป็น Base64
                imageName: data.imageName,
                animalType: data.animalType.type // ส่งเฉพาะ type จาก AnimalType
            });
        }).catch((err) => {
            res.status(400).json({ message: err.message || `Something went wrong, Can't find animal id:${req.params.id} data..` });
        });
    } catch (err) {
        res.status(400).json({ message: err.message || "Bad Request" });
    }
};

exports.create = (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: "File upload error: " + err.message });
        }

        try {
            if (!req.body.animalName || !req.body.animalTypeId) {
                return res.status(400).json({ message: "Data can't be empty!" });
            }

            const animalObj = {
                animalName: req.body.animalName,
                behavior: req.body.behavior,
                habitat: req.body.habitat,
                reproduction: req.body.reproduction,
                diet: req.body.diet,
                conservation: req.body.conservation,
                image: req.file ? req.file.filename : null,
                imageName: req.file ? req.file.originalname : null,
                animalTypeId: req.body.animalTypeId
            };

            Animal.create(animalObj)
                .then(() => {
                    res.status(201).json({ message: "Animal created successfully" });
                }).catch(err => {
                    res.status(500).json({ message: err.message || "Something went wrong, can't create animal" });
                });
        } catch (err) {
            res.status(400).json({ message: err.message || "Bad Request" });
        }
    });
};

exports.update = (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: "File upload error: " + err.message });
        }

        try {
            if (!req.body.animalTypeId || !req.params.id) {
                return res.status(400).json({ message: "Data can't be empty!" });
            }

            const animalObj = {
                animalName: req.body.animalName,
                behavior: req.body.behavior,
                habitat: req.body.habitat,
                reproduction: req.body.reproduction,
                diet: req.body.diet,
                conservation: req.body.conservation,
                image: req.file ? req.file.filename : req.body.image, // ใช้ filename ของไฟล์ที่อัปโหลดหรือค่าที่มีอยู่
                animalTypeId: req.body.animalTypeId
            };

            Animal.update(animalObj, {
                where: { id: req.params.id }
            }).then((data) => {
                res.status(200).json({ message: "Animal updated successfully" });
            }).catch(err => {
                res.status(500).json({ message: err.message || `Something went wrong, can't update animal id: ${req.params.id}` });
            });
        } catch (err) {
            res.status(400).json({ message: err.message || "Bad Request" });
        }
    });
};

const fs = require('fs');
const path = require('path');

exports.delete = (req, res) => {
    try {
        // Step 1: Find the animal by id to get its imageName
        Animal.findByPk(req.params.id).then(animal => {
            if (!animal) {
                return res.status(404).json({ message: "Animal not found" });
            }

            const fileName = animal.imageName; // Get the imageName of the animal
            const filePath = path.join(__dirname, '../../uploads', fileName); // Construct the file path

            // Step 2: Delete the animal record
            Animal.destroy({
                where: { id: req.params.id }
            }).then(data => {
                if (data === 1) {
                    // Step 3: Check if the file exists and delete it
                    if (fileName) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err.message}`);
                            } else {
                                console.log('File deleted successfully!');
                            }
                        });
                    }
                    res.status(200).json({ message: "Animal deleted" });
                } else {
                    res.status(404).json({ message: "Animal not found" });
                }
            }).catch(err => {
                res.status(500).json({ message: err.message || "Error deleting animal" });
            });
        }).catch(err => {
            res.status(500).json({ message: err.message || "Error finding animal" });
        });
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};
