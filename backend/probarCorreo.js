require('dotenv').config();
const emailService = require('./src/services/emailService');

emailService.enviarNotificacionPublicacion({ destinatario: 'mariacamilavella@gmail.com', ong_nombre: 'Refugio Milagrinos', titulo: 'Prueba de correo', descripcion: 'Este es un correo de prueba desde la plataforma.', tipo: 'actualizacion'
}).then(() => { console.log('✅ Correo enviado exitosamente');
}).catch((error) => { console.error('❌ Error al enviar correo:', error.message);
});