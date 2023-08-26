import Service from "../models/service.model.js";
export const registerService = async (req, res, next) => {
    try {  
      const newService = new Service({
        ...req.body,
      });
  
      await newService.save();
      res.status(201).send("Form has been submitted.");
    } catch (err) {
      next(err);
    }
  };


  export const admingetServices = async (req, res, next) => {
    const q = req.query;
  
    const filters = {
      ...(q.search && { _id: q.search }),
    };
    try {
      const service = await Service.find(filters).sort({ [q.sort]: -1, createdAt: -1 });
      res.status(200).send(service);
    } catch (err) {
      next(err);
    }
  };
  
  export const adminSelectedDeleteService = async (req, res, next) => {
    try {
      const idsString = req.params.ids;
      const idsToDelete = idsString.split(',');
      
      if (idsToDelete && idsToDelete.length) {
        await Service.deleteMany({ _id: { $in: idsToDelete } });
        res.status(200).send("Services have been deleted!");
      } else {
        res.status(400).send("No Services provided");
      }
    } catch (err) {
      next(err);
    }
  };