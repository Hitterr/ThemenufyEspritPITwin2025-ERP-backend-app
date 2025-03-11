const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { generateAccessToken, generateRefreshToken } = require("/projetPIBackend/the-menufy-backend/src/utils/jwt");
const User = require("/projetPIBackend/the-menufy-backend/src/models/user");
const { userSchema } = require("/projetPIBackend/the-menufy-backend/src/modules/user/validators/userValidator");
const verificationCodeTemplate = require("C:/projetPIBackend/the-menufy-backend/src/utils/templates/verificationCodeTemplate"); // Ajustez le chemin selon votre structure

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // Ignore les erreurs de certificat auto-signé
    }
});

class SignupController {
    // Générer un code de vérification aléatoire
    generateVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Code à 6 chiffres
    }

    // Envoyer l'email de vérification avec le template HTML
    sendVerificationEmail = async (email, verificationCode) => {
        const htmlContent = verificationCodeTemplate(verificationCode); // Générer le contenu HTML avec le code

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Vérification de votre compte The Menufy',
            html: htmlContent // Utiliser html au lieu de text
        };

        await transporter.sendMail(mailOptions);
    }

    register = async (req, res) => {
        try {
            await userSchema.validate(req.body, { abortEarly: false });

            const { firstName, lastName, email, password, phone, address, birthday, image } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Cet email est déjà utilisé." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationCode = this.generateVerificationCode();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // Expire dans 10 minutes

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone: phone ? Number(phone) : null, // Conversion pour correspondre au modèle
                address,
                birthday,
                image,
                role: "client",
                isEmailVerified: false,
                authProvider: "local",
                verificationCode,
                verificationCodeExpires,
            });

            await newUser.save();

            await this.sendVerificationEmail(email, verificationCode);

            return res.status(201).json({
                success: true,
                message: "Inscription réussie. Veuillez vérifier votre email avec le code envoyé.",
                data: {
                    userId: newUser._id
                }
            });
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            if (error.name === "ValidationError") {
                return res.status(400).json({ success: false, errors: error.errors });
            }
            return res.status(500).json({ success: false, message: "Erreur lors de l'inscription." });
        }
    }

    verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        // Vérification de la présence des champs requis
        if (!email || !verificationCode) {
            return res.status(400).json({ 
                success: false, 
                message: "Email et code de vérification sont requis." 
            });
        }

        // Recherche de l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Utilisateur non trouvé avec cet email." 
            });
        }

        // Vérification si l'email est déjà vérifié
        if (user.isEmailVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Email déjà vérifié." 
            });
        }

        // Vérification du code de vérification
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ 
                success: false, 
                message: "Code de vérification invalide." 
            });
        }

        // Vérification de l'expiration du code
        if (user.verificationCodeExpires < new Date()) {
            return res.status(400).json({ 
                success: false, 
                message: "Code de vérification expiré." 
            });
        }

        // Mise à jour de l'utilisateur
        user.isEmailVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;

        // Génération des tokens
        const accessToken = generateAccessToken({ email: user.email });
        const refreshToken = generateRefreshToken({ email: user.email });

        // Sauvegarde des modifications
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email vérifié avec succès.",
            data: {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error("Erreur lors de la vérification :", error);
        return res.status(500).json({ 
            success: false, 
            message: "Erreur lors de la vérification de l'email." 
        });
    }
};
}

module.exports = new SignupController();