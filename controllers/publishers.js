// File: controllers/publishers.js
let PublisherModel = require('../schemas/publishers');

module.exports = {
    GetAllPublishers: async function () { 
        return await PublisherModel.find({}); 
    },
    GetPublisherById: async function (id) {
        try { 
            return await PublisherModel.findById(id); 
        } catch (error) { 
            return false; 
        }
    },
    CreatePublisher: async function (data) {
        let newPublisher = new PublisherModel(data);
        await newPublisher.save();
        return newPublisher;
    },
    
    UpdatePublisher: async function (id, data) { 
        return await PublisherModel.findByIdAndUpdate(id, data, { new: true }); 
    },
    DeletePublisher: async function (id) { 
        return await PublisherModel.findByIdAndDelete(id); 
    }
};