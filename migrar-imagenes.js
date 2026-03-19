import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

cloudinary.config({
  cloud_name: 'dslcwmoc6',
  api_key: '329379538296669',
  api_secret: 'gRV42EV_FOH0aGXV9P_6tFqsZjo'
});

const supabase = createClient(
  'https://geilroobnavmcalhkore.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlaWxyb29ibmF2bWNhbGhrb3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDYxOTksImV4cCI6MjA4NzY4MjE5OX0.3EBX0QWlpDvg9Ig4-a0cXRTelk9R0fI3YTPbv1SzRAs'
);

async function migrarImagenes() {
  const { data: imagenes, error } = await supabase
    .from('imagenes_publicacion')
    .select('id, imagen_url');

  if (error) {
    console.error('Error obteniendo imágenes:', error);
    return;
  }

  console.log(`📦 ${imagenes.length} imágenes encontradas`);

  for (const imagen of imagenes) {
    try {
      console.log(`⬆️ Subiendo imagen ID ${imagen.id}...`);

      const result = await cloudinary.uploader.upload(imagen.imagen_url, {
        folder: 'fundacion',
      });

      const { error: updateError } = await supabase
        .from('imagenes_publicacion')
        .update({ imagen_url: result.secure_url })
        .eq('id', imagen.id);

      if (updateError) {
        console.error(`❌ Error actualizando ID ${imagen.id}:`, updateError);
      } else {
        console.log(`✅ ID ${imagen.id} migrada correctamente`);
      }

    } catch (err) {
      console.error(`❌ Error en ID ${imagen.id}:`, err.message);
    }
  }

  console.log('🎉 Migración completada');
}

migrarImagenes();
