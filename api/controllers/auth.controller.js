import User from "../models/user.model.js";
import Admin from "../models/admin.model.js"
import Token from "../models/token.js";
import sendEmail from "../utils/sendEmail.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import crypto from "crypto"
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);

    const existingEmail = await User.findOne({ email: req.body.email });


    if (existingEmail) {
      return res.status(400).send("Email already exists*");
    };
    
   

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send("Username already exists*");
    }

    const newUser = new User({
      ...req.body,
      password: hash,
    });

  const user = await newUser.save();

    const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.BASE_URL}auth/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);
		res.status(201).send("An Email sent to your account please verify");
  
  } catch (err) {
    next(err);
  }
};



export const adminLogin = async (req, res, next) => {
  try {
   
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) return next(createError(404, "Admin not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, admin.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

     
        const token = jwt.sign(
          {
            id: admin._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1d", // Token will expire after one day
          }
        );
      
        const { password, ...info } = admin._doc;
        res
          .cookie("accessToken", token, {
            httpOnly: true,
          })
          .status(200)
          .send(info);
      
  }catch(err)
  {
    next(err);
  }
};

export const verifyUser = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send( "Invalid link" );
 
		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
   
		if (!token)
    return res.status(400).send( "Invalid link" );

    try {
      if (!user.verified) {
        await User.updateOne({ _id: user._id }, { verified: true });
      }
    } catch (error) {
      console.log(error);
      // Handle the error as needed
    }
    
		await token.remove();
    

		res.status(200).send( "Email verified successfully");
	} catch (error) {
		res.status(500).send("Internal Server Error" );
	}
  
};







export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

   const blockedStatus = user.isBlocked
   if(blockedStatus) return next(createError(400, "You Account is Blocked"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    // Check if the user is verified


    if (!user.verified) {
      
      let token = await Token.findOne({ userId: user._id });
      let isTokenGenerated = false;
    
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        isTokenGenerated = true;
      }
    
      const url = `${process.env.BASE_URL}auth/${user.id}/verify/${token.token}`;
      const emailSent = await sendEmail(user.email, "Verify Email", url);

      if (!emailSent) {
        if (isTokenGenerated) {
          return res.status(401).send("An Email sent to your account. Please verify.");
        } else {
          return res.status(401).send("An Email is resent to your account. Please verify.");
        }
      } else {
        return res.status(401).send("Email not sent");
      }
    }
    
    // If the user is already verified, you can continue with the rest of your logic here.
    

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1d", // Token will expire after one day
      }
    );
    
    const { password, ...info } = user._doc;
    res.status(200).json({ token, info });

  } catch (err) {
    next(err);
  }
};


export const forgetPass = async (req, res, next) => {

  try{
       const user = await User.findOne({ email: req.body.email });
     if (!user) {
        return next(createError(404, "User not found!"));
     }

     let token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		const url = `${process.env.BASE_URL}auth/${user._id}/${token.token}/`;
		await sendEmail(user.email, "Password Reset", url);

		res.status(200).send( "Password reset link sent to your email account" );
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
};

export const verifyPass = async (req, res) => {
  try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send("Invalid link" );

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send("Invalid link" );

		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
};

export const newPass = async (req, res) => {
try{
  const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		if (!user.verified) user.verified = true;
    const hashPassword =  bcrypt.hashSync(req.body.password, 5);
    user.password = hashPassword;
		await user.save();
		await token.remove();

		res.status(200).send( "Password reset successfully" );
	} catch (error) {
		res.status(500).send( "Internal Server Error" );
	}
}




export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    }).status(200).send("User has been logged out.");
};
