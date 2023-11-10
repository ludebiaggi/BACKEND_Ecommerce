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
    //try {
    //    await transporter.sendMail(messageOpt);
    //    res.send("Mensaje enviado");
    //    res.redirect("/api/mail");
    //} catch (error) {
    //    console.error("Error al enviar el correo:", error);
    //    res.send("Error al enviar el correo.");
    //}
    await transporter.sendMail(messageOpt);
    res.send('Mail enviado correctamente!')
});

export default router;


