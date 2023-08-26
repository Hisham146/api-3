//import createError from './../utils/createError.js';
import Report from './../models/report.model.js'


export const postReport = async (req, res, next) => {
    try{
    const newReport = new Report({
        ...req.body,
      });
  
      await newReport.save();
      res.status(200).send( "Report Submitted successfully");
    }
    catch(err){
        next(err);
    }
};

export const getReports = async (req, res) => {
    try {
      const q = req.query;
      const filters = {};

      if (q.search) {
        filters.$or = [
          { sellerId: q.search },
          { BuyerId: q.search }
        ];
      }
      const reports = await Report.find(filters).sort({ createdAt: -1 });
  
      res.status(200).send(reports);
    } catch (err) {
      next(err);
    }
  };

  export const adminSelectedDeleteAd = async (req, res, next) => {
    try {
      const idsString = req.params.ids;
      const idsToDelete = idsString.split(',');
      
      if (idsToDelete && idsToDelete.length) {
        await Report.deleteMany({ _id: { $in: idsToDelete } });
        res.status(200).send("Reports have been deleted!");
      } else {
        res.status(400).send("No Reports provided");
      }
    } catch (err) {
      next(err);
    }
  };