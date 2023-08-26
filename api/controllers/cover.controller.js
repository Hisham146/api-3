import Cover from '../models/cover.model.js';
import TemporaryCoverSelect from '../models/selected.model.js';
import { createCanvas, loadImage } from 'canvas';



export const addNewCover = async (req, res, next) => {

    const newCover = new Cover ({
      ...req.body,
    });
  
    try {
      const savedCover = await newCover.save();
      res.status(201).json(savedCover);
    } catch (err) {
      next(err);
    }
  };



export const getCover = async (req, res, next) => {
  try {
    const covers = await Cover.find().sort({ createdAt: -1 });

    // Create a canvas to render the images
    const canvasWidth = 1200; // Adjust these dimensions as needed
    const canvasHeight = 500;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const renderedCovers = [];

    for (const cover of covers) {
      // Load the image from the URL
      const img = await loadImage(cover.cover);

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/jpeg'); // You can adjust the format if needed

      // Add the _id and data URL to the renderedCovers array
      renderedCovers.push({
        _id: cover._id, // Assuming _id is a valid property of the Cover model
        imageUrl: dataUrl,
      });
    }

    res.status(200).send(renderedCovers);
  } catch (err) {
    next(err);
  }
};


export const deleteCover = async (req, res, next) => {
  try {
    await Cover.findByIdAndDelete(req.params.id);
    res.status(200).send("Cover has been deleted!");
  } catch (err) {
    next(err);
  }
};



export const selectedCover = async (req, res, next) => {
  try {
    const { id } = req.params;
    const predefinedId = process.env.CoverId; // Replace with your predefined _id value

    // Find the existing record by predefined _id value
    const temp = await TemporaryCoverSelect.findOne({ _id: predefinedId });

    if (!temp) {
      return res.status(404).json({ message: 'Temporary cover record not found.' });
    }

    // Update the appliedId field
    temp.appliedId = id;
    await temp.save();

    res.status(200).json({ message: 'Selected image ID saved.' });
  } catch (err) {
    next(err);
  }
};


export const selectedCoverApply = async (req, res, next) => {
  try {
    const predefinedId = process.env.CoverId;
    const temp = await TemporaryCoverSelect.findOne({ _id: predefinedId });
    const selectedImageId = temp.appliedId;
    if(!selectedImageId) res.status(400).send("No Cover is selected");
          // Find the selected cover by ID
          const selectedcoverapply = await Cover.findById(selectedImageId);
         
          if (!selectedcoverapply) {
            return null;
          }
      
          // Create a canvas to render the image
          const canvasWidth = 1980; // Adjust these dimensions as needed
          const canvasHeight = 720
          const canvas = createCanvas(canvasWidth, canvasHeight);
          const ctx = canvas.getContext('2d');
      
          // Load the image from the URL
          const img = await loadImage(selectedcoverapply.cover);
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      
          // Convert the canvas to a data URL
          const dataUrl = canvas.toDataURL('image/jpeg'); // You can adjust the format if needed
     
          res.status(200).send(dataUrl);
  } catch (err) {
    next(err);
  }
};


