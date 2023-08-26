import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import createError from './../utils/createError.js';


export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
   const userId = req.params.id
  if (userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  const deleted = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ deleted });
};

export const adminblockUser = async (req, res, next) => {
  try {
    const blockeduser = await User.findById(req.params.id);

    blockeduser.isBlocked = true;
    await blockeduser.save();

    res.status(200).send("User has been Blocked!");

  } catch (err) {
    next(err);
  }
};


export const getUser = async (req, res, next) => {
  try{
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
  }
  catch(err)
  {
    next(err)
  }
};


export const adminunblockUsers = async (req, res, next) => {
try{
  
  const Unblock = await User.findById(req.params.id);
     Unblock.isBlocked = false;
    const unblocked = await Unblock.save();
  res.status(200).json({ unblocked });
}catch(err){
next(err)
}
};




export const admindeleteUser = async (req, res, next) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ deleted });
};

export const adminSelectedDeleteUser = async (req, res, next) => {
  try {
    const idsString = req.params.ids;
    const idsToDelete = idsString.split(',');
    
    if (idsToDelete && idsToDelete.length) {
      await User.deleteMany({ _id: { $in: idsToDelete } });
      res.status(200).send("Users have been deleted!");
    } else {
      res.status(400).send("No Users provided");
    }
  } catch (err) {
    next(err);
  }
};


export const getBlockedUsers = async (req, res, next) => {
  try {
    const q = req.query;
    const filters = {
      ...(q.isBlocked === 'true' && { isBlocked: true }), // filter by isBlocked if the query parameter is set to 'true'
      ...(q.search && { _id: q.search }),
    };
    const users = await User.find(filters).sort({ createdAt: -1 });

    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};


export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found!"));
    }
    const userId = req.params.id
    if (userId !== user._id.toString()) {
      return next(createError(403, "You can update only your Id!"));
    }
      const storedEmail = user.email;
      const newEmail = req.body.email
  
     user.firstname = req.body.firstname;
     user.lastname = req.body.lastname;
     user.phone = req.body.phone;
     user.email = req.body.email;

     let message = ''; 

     if (storedEmail !== newEmail) {
       user.verified = false;
       message = 'Email changed. Please verify your email now.'; 
     }
 
     const updatedUser = await user.save();
 
     res.status(200).json({ message, updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId); // Use userId from params
    if (!user) {
      return next(createError(404, "User not found!"));
    }
  const userId = req.params.userId
    if (userId !== user._id.toString()) {
      return next(createError(403, "You can update only your Account Password!"));
    }

    const isCorrect = bcrypt.compareSync(req.body.oldPassword, user.password);
    if (!isCorrect) {
      return next(createError(400, "Old Password is Wrong!"));
    }

    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 5); // Hash the new password
    user.password = hashedPassword; // Update the password
     await user.save();

      res.status(200).json({message: "Password Changed successfully"});
  } catch (err) {
    next(err);
  }
};


export const getUsers = async (req, res) => {
  try {
    const q = req.query;
    const filters = {
      ...(q.search && { _id: q.search }),
    };
    const users = await User.find(filters).sort({ createdAt: -1 });

    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};


//  { username: { $regex: q.search, $options: "i" } },
//  { _id: { $regex: q.search, $options: "i" } },
//  { firstname: { $regex: q.search, $options: "i" } },
//  { lastname: { $regex: q.search, $options: "i" } },