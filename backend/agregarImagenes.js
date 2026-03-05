require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const imagenes = [
  // Asociación Nueva Vida Mujer - mujeres comunidad
  { id: 1, imagen_url: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=400' },
  // Acción contra el hambre - distribución de alimentos
  { id: 2, imagen_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400' },
  // Aldeas Infantiles SOS - niños en clase
  { id: 3, imagen_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400' },
  // Ayuda en acción - donación comunitaria
  { id: 4, imagen_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400' },
  // Humedales Bogotá - naturaleza humedal
  { id: 5, imagen_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400' },
  // Fundación MIA - perros y gatos
  { id: 6, imagen_url: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400' },
  // Refugio Milagrinos - perros rescatados
  { id: 7, imagen_url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400' },
  // Educación para Todos - niños con tablet
  { id: 8, imagen_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400' },
  // Cruz Roja - ayuda humanitaria
  { id: 9, imagen_url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400' },
  // Juventud Activa - jóvenes jugando fútbol
  { id: 10, imagen_url: 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=400' },
];

async function actualizarImagenes() {
  for (const item of imagenes) {
    const { error } = await supabase
      .from('publicaciones')
      .update({ imagen_url: item.imagen_url })
      .eq('id', item.id);

    if (error) {
      console.error(`❌ Error en id ${item.id}:`, error.message);
    } else {
      console.log(`✅ id ${item.id} actualizado`);
    }
  }
  console.log('¡Listo!');
}

actualizarImagenes();