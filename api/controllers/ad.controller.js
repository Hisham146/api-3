import Ad from "../models/ad.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
//import axios from 'axios';

export const createAd = async (req, res, next) => {
  const newAd = new Ad({
     userId: req.params.id,
    ...req.body,
  });

  try {
    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (err) {
    next(err);
  }
};
export const deleteAd = async (req, res, next) => {
  try { 
    const ad = await Ad.findById(req.params.id);
    if(!ad) return next(createError(403, "No ad found!"));
    const userId = req.query.userId;
    if (ad.userId !== userId)
      return next(createError(403, "You can delete only your ad!"));
     console.log("id", ad._id  );
    await Ad.findByIdAndDelete(ad._id);
    res.status(200).send("Ad has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const admindeleteAd = async (req, res, next) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.status(200).send("Ad has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getAd = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) next(createError(404, "Ad not found!"));
    res.status(200).send(ad);
  } catch (err) {
    next(err);
  }
};

export const updateAd = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return next(createError(404, "Ad not found!"));
    }
    const userId = req.query.userId;
    if (ad.userId !== userId) {
      return next(createError(403, "You can update only your ad!"));
    }
  

    // Update the ad data with the new values from req.body
    ad.title = req.body.title;
    ad.shortDesc = req.body.shortDesc;
    ad.price = req.body.price;
    ad.vehiclemake = req.body.vehiclemake;
    ad.contact = req.body.contact;
    ad.location = req.body.location;
    ad.desc = req.body.desc;
    ad.vehiclemodel = req.body.vehiclemodel;
    ad.vehiclevarient = req.body.vehiclevarient;
    ad.registeryear = req.body.registeryear;
    ad.registercity = req.body.registercity;
    ad.transmission = req.body.transmission;
    ad.mileage = req.body.mileage;
    ad.fueltype = req.body.fueltype;
    ad.ownername = req.body.ownername;
    // Add other properties here as needed

    // Save the updated ad to the database
    const updatedAd = await ad.save();

    res.status(200).json(updatedAd);
  } catch (err) {
    next(err);
  }
};


export const getAds = async (req, res, next) => {
  const q = req.query;
  const searchQuery = q.search
    ? q.search.split(' ').map(word => `(?=.*${word})`).join('')
    : null;

  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(searchQuery && { title: { $regex: searchQuery, $options: "i" } }), // Use the modified searchQuery
    ...(q.vehiclemake && { vehiclemake: q.vehiclemake }),
    ...(q.vehiclemodel && { vehiclemodel: q.vehiclemodel }),
    ...(q.location && { location: q.location }),
  };

  try {
    const ads = await Ad.find(filters).sort({ [q.sort]: -1, createdAt: -1 });
    res.status(200).send(ads);
  } catch (err) {
    next(err);
  }
};

export const admingetAds = async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.search && { userId: q.search }),
  };
  try {
    const ads = await Ad.find(filters).sort({ [q.sort]: -1, createdAt: -1 });
    res.status(200).send(ads);
  } catch (err) {
    next(err);
  }
};

export const adminSelectedDeleteAd = async (req, res, next) => {
  try {
    const idsString = req.params.ids;
    const idsToDelete = idsString.split(',');
    
    if (idsToDelete && idsToDelete.length) {
      await Ad.deleteMany({ _id: { $in: idsToDelete } });
      res.status(200).send("Ads have been deleted!");
    } else {
      res.status(400).send("No Ads provided");
    }
  } catch (err) {
    next(err);
  }
};

export const userMyAds = async (req, res, next) => {
  try{
    const checkUser = await User.findOne({ _id: req.params.id});
    if (!checkUser) {
      return res.status(400).send("Username doesn't exist*");
    }
   
    const ads = await Ad.find({ userId: req.params.id }).sort({ createdAt: -1 }).exec();
     res.status(200).send(ads);

  }catch(err){
   next(err)
  }
}

export const getuserAds = async (req, res, next) => {
  try{
    const checkUser = await User.findOne({ _id: req.params.id});
    if (!checkUser) {
      return res.status(400).send("Username doesn't exist*");
    }
   
    const ads = await Ad.find({ userId: req.params.id }).sort({ createdAt: -1 }).exec();
     res.status(200).send(ads);

  }catch(err){
   next(err)
  }
}


// export const getAds = async (req, res, next) => {
//   try {

//     const q = req.query;
//     const filters = {
//       ...(q.userId && { userId: q.userId }),
//       ...(q.search && { title: { $regex: q.search, $options: "i" } }),
      
//     };

//     const ads = await Ad.find(filters).sort({ createdAt: -1 });
//     res.status(200).send(ads);
//   } catch (err) {
//     next(err);
//   }
// };


    // ...(q.location && { location: city }),
    // const response = await axios.get(`https://ipapi.co/city/`);
    // const city = response.data;
    // filters.location = city
