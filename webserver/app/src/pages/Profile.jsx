import React from 'react';

function Profile() {
  return (
    <div className="container">
      <section className='hero-section bg-white rounded-3xl p-8 shadow-lg'>
        <div className='flex items-start justify-between'>
          {/* Colonne gauche : Avatar + Infos */}
          <div className='flex gap-6'>
            {/* Avatar circulaire */}
            <div className='w-20 h-20 bg-gray-300 rounded-full flex-shrink-0'></div>
            
            {/* Infos texte */}
            <div>
              <h2 className='text-2xl font-bold'>Nom/Pseudo</h2>
              <p className='text-gray-600 text-sm'>★★★★★</p>
              <div className='mt-3 space-y-1 text-sm'>
                <p><span className='font-semibold'>Prénom:</span> John</p>
                <p><span className='font-semibold'>Email:</span> john@example.com</p>
              </div>
            </div>
          </div>

          {/* Bouton modifier */}
          <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>
            Modifier le profil
          </button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
