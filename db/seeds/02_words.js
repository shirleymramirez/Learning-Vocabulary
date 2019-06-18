
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('words').del()
    .then(function () {
      // Inserts seed entries
      return knex('words').insert([
        { word: 'table', language: 'Spanish', translation: 'mesa', count: 0, status: 'blue', user_id: 1 },
        { word: 'chair', language: 'Spanish', translation: 'silla', count: 0, status: 'blue', user_id: 1 },
        { word: 'spoon', language: 'Spanish', translation: 'chuchara', count: 0, status: 'blue', user_id: 1 },
        { word: 'computer', language: 'Spanish', translation: 'computadora', count: 0, status: 'blue', user_id: 2 },
        { word: 'car', language: 'Spanish', translation: 'coche', count: 0, status: 'blue', user_id: 2 },
        { word: 'class', language: 'Spanish', translation: 'clase', count: 0, status: 'blue', user_id: 2 },
        { word: 'glass', language: 'Spanish', translation: 'vaso', count: 0, status: 'blue', user_id: 3 },
        { word: 'food', language: 'Spanish', translation: 'comida', count: 0, status: 'blue', user_id: 3 },
        { word: 'cake', language: 'Spanish', translation: 'pastel', count: 0, status: 'blue', user_id: 3 },
      ]);
    });
};
