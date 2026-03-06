const sharp = require('sharp');

sharp('public/logo.jpeg')
  .extract({ left: 0, top: 0, width: 200, height: 200 })
  .toFile('public/icono.png', (err, info) => {
    if (err) console.error('Error:', err);
    else console.log('✅ Ícono recortado exitosamente');
  });