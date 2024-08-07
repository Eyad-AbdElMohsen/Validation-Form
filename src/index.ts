import express , {Express , Request , Response}from "express" 
import bodyParser, { urlencoded } from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { check,body , validationResult } from "express-validator";

dotenv.config({path : 'config.env'});
const app : Express = express();
const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname , 'assets')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views' , 'views')

app.get("/",(req : Request ,res : Response) =>{
    res.render('form');
})
app.post("/" , [
    check("fullName" , "Name cant have a number")
        .exists().withMessage("Full name is required")
        .matches(/^[A-Za-z\s]+$/).withMessage("Name can only contain letters and spaces"),
    
    check("email" , "Email must be valid gmail")
        .exists().withMessage("Email is required")
        .isEmail().withMessage("invalid Email")
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/).withMessage("Email must be a valid Gmail"),

    check("password" , "Must be between 8 and 64 characters, contain at least one number, one uppercase character and one lowercase character")
        .exists().withMessage("Password is required")
        .isLength({ min: 8, max: 64 }).withMessage("Password must be between 8 and 64 characters long")
        .matches(/(?=.*\d)/).withMessage("Password must contain at least one number")
        .matches(/(?=.*[a-z])/).withMessage("Password must contain at least one lowercase letter")
        .matches(/(?=.*[A-Z])/).withMessage("Password must contain at least one uppercase letter"),
    
    body("confirmPassword" , "Confirm your password")
    .custom((value : string , { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        else return true;
    }),

    check("birthday" , "Must be a date")
        .exists().withMessage("Birthday is required")
        .isDate().withMessage("Invalid date format"),
],(req : Request ,res : Response) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).jsonp(errors.array());
    }
    else
        res.send("SUCCESSFUL");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
