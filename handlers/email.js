// Importar los módulos requeridos
const emailConfig = require("../config/mailtrap");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const util = require("util");

// Configurar la capa de transporte del correo
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e07be47b77e23c",
    pass: "37daa2807eddcd"
  }
});

// Template para el envío del correo
transport.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: `${__dirname}/../views/emails`,
      layouts: `${__dirname}/../views/emails`,
      defaultLayout: "",
    },
    viewPath: `${__dirname}/../views/emails`,
    extName: ".hbs",
  })
);

// Encabezado del correo electrónico
exports.enviarCorreo = async (opciones) => {
    const opcionesCorreo = {
      from: " Cashize <hola@cashize.com>",
      to: opciones.to,
      subject: opciones.subject,
      template: opciones.template,
      context: {
        resetUrl: opciones.resetUrl,
        nombre: opciones.nombre,
      },
    };
  
    // Enviar el correo mediante una promesa
    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, opcionesCorreo);
  };
  
