import Contact from "../models/contact.model.js";


export const postContact = async (req, res, next)=> {
    try
    { const newContact = Contact({
        ...req.body
      });
     const formsaved = await newContact.save();
      res.status(201).json(formsaved);
    }
    catch(err)
    {
       next(err);
    }
};

export const getContacts = async (req,res,next) =>{
  const q = req.query;

  const filters = {
    ...(q.search && { email: q.search }),
  };
try{
      const contacts= await Contact.find(filters).sort({createdAt:-1});
       res.status(200).send(contacts)
      }catch(err){
        next(err);
      }
};

export const selectedDeleteContact = async (req, res, next) => {
    try {
      const idsString = req.params.ids;
      const idsToDelete = idsString.split(',');
      
      if (idsToDelete && idsToDelete.length) {
        await Contact.deleteMany({ _id: { $in: idsToDelete } });
        res.status(200).send("Contact forms have been deleted!");
      } else {
        res.status(400).send("No Contact Form is provided");
      }
    } catch (err) {
      next(err);
    }
  };
  