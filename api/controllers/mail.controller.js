
import nodemailer from 'nodemailer';
export const sendMail = async (req, res, next) => {
    try {
 const{firstname,lastname,phone,email,city,
    vehiclemake,vehiclemodel,vehiclevarient,serviceType,servicefield} = req.body;

        
         const transporter = nodemailer.createTransport({
        
            host: process.env.HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            }
        });
        

        const mailOptions = {
            from: `"Service Requeset"`,
            to: process.env.USER,
            subject:"Service Request",
            //html: `<p>Form data:</p>${tableHtml}`
           // text:'FORM DATA', firstname, lastname, email,phone,city,vehiclemake,vehiclemodel,vehiclevarient,serviceType,servicefield
           text: `Form data: \n
           First Name: ${firstname}\n
           Last Name: ${lastname}\n
          Email: ${email}\n
           Phone: ${phone}\n
           City: ${city}\n
           Vehicle Make: ${vehiclemake}\n
           Vehicle Model: ${vehiclemodel}\n
           Vehicle Varient: ${vehiclevarient}\n
           Service Type: ${serviceType}\n
           Service Field: ${servicefield}\n
         `
        }

       await transporter.sendMail(mailOptions,(error,info)=>{
         if(error){

         }else{

        res.status(201).json(info);
         }
       });
        

    }
    catch(error)
    {
        res.status(201).json({status:401, info})
    }
};
