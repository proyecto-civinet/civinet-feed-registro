require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const ongs = [
  {
    id: 1,
    descripcion: 'Organización que apoya a mujeres en situación de vulnerabilidad mediante mercados solidarios y emprendimiento.',
    imagen_url: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=400'
  },
  {
    id: 2,
    descripcion: 'Fundación dedicada a combatir el hambre mediante voluntariado y distribución de alimentos a comunidades necesitadas.',
    imagen_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400'
  },
  {
    id: 3,
    descripcion: 'Organización internacional que brinda educación y cuidado a niños y jóvenes en situación de vulnerabilidad.',
    imagen_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400'
  },
  {
    id: 4,
    descripcion: 'ONG que trabaja por el desarrollo comunitario y la mejora de calidad de vida de poblaciones vulnerables.',
    imagen_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400'
  },
  {
    id: 5,
    descripcion: 'Fundación ambiental dedicada a la conservación y protección de los humedales de Bogotá.',
    imagen_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400'
  },
  {
    id: 6,
    descripcion: 'Fundación de rescate y protección animal que busca veterinarios voluntarios para jornadas de esterilización.',
    imagen_url: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400'
  },
  {
    id: 7,
    descripcion: 'Refugio dedicado al cuidado y alimentación de perros y gatos callejeros en Colombia.',
    imagen_url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400'
  },
  {
    id: 8,
    descripcion: 'Fundación que promueve la educación digital donando tablets y computadores a niños vulnerables.',
    imagen_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400'
  },
  {
    id: 9,
    descripcion: 'Organización humanitaria que apoya a familias afectadas por desastres naturales con cobijas y ayuda básica.',
    imagen_url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400'
  },
  {
    id: 10,
    descripcion: 'Fundación que promueve el deporte en jóvenes para prevenir el consumo de sustancias psicoactivas.',
    imagen_url: 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=400'
  },
];

async function llenarONGs() {
  for (const ong of ongs) {
    const { error } = await supabase
      .from('ongs')
      .update({ descripcion: ong.descripcion, imagen_url: ong.imagen_url })
      .eq('id', ong.id);

    if (error) {
      console.error(`❌ Error en id ${ong.id}:`, error.message);
    } else {
      console.log(`✅ ONG id ${ong.id} actualizada`);
    }
  }
  console.log('¡Listo!');
}

llenarONGs();
