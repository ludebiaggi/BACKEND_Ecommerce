import { Router } from "express";
import { transporter } from "../nodemailer.js";
const router = Router();

router.get("/api/mail", async (req, res)=>{
    const messageOpt ={
        from: "luu.debiaggi@gmail.com", 
        to: "leodebiaggi@gmail.com",
        subject: "GRACIAS POR TU COMPRA",
        text: "Tu número de orden es ...",
    };
    try {
        await transporter.sendMail(messageOpt);
        res.send("Mensaje enviado");
        res.redirect("/api/mail");
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.send("Error al enviar el correo.");
    }
});

export default router;

