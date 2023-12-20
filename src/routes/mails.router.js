import { Router } from "express";
import { transporter } from "../nodemailer.js";
const router = Router();

router.get("/", async (req, res)=>{
    const messageOpt ={
        from: "luu.debiaggi@gmail.com", 
        to: "luu.debiaggi@gmail.com",
        subject: "GRACIAS POR TU COMPRA",
        text: "Pronto recibirás tus productos!",
    };
    await transporter.sendMail(messageOpt);
    res.send('Mail enviado correctamente!')
});

export default router;


