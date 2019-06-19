
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('words').del()
    .then(function () {
      // Inserts seed entries
      return knex('words').insert([
        { word: 'table', language: 'es', translation: 'mesa', count: 0, status: 'blue', user_id: 1 },
        { word: 'chair', language: 'es', translation: 'silla', count: 0, status: 'blue', user_id: 1 },
        { word: 'spoon', language: 'es', translation: 'chuchara', count: 0, status: 'blue', user_id: 1 },
        { word: 'computer', language: 'es', translation: 'computadora', count: 0, status: 'blue', user_id: 2 },
        { word: 'car', language: 'es', translation: 'coche', count: 0, status: 'blue', user_id: 2 },
        { word: 'class', language: 'es', translation: 'clase', count: 0, status: 'blue', user_id: 2 },
        { word: 'glass', language: 'es', translation: 'vaso', count: 0, status: 'blue', user_id: 3 },
        { word: 'food', language: 'es', translation: 'comida', count: 0, status: 'blue', user_id: 3 },
        { word: 'cake', language: 'es', translation: 'pastel', count: 0, status: 'blue', user_id: 3 },
      ]);
    });
};
