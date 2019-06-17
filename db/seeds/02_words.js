
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('words').del()
    .then(function () {
      // Inserts seed entries
      return knex('words').insert([
        { word: 'table', language: 'Spanish', translation: 'mesa', status: 'yellow', user_id: 1 },
        { word: 'chair', language: 'Spanish', translation: 'silla', status: 'yellow', user_id: 1 },
        { word: 'spoon', language: 'Spanish', translation: 'chuchara', status: 'yellow', user_id: 1 },
        { word: 'computer', language: 'Spanish', translation: 'computadora', status: 'yellow', user_id: 2 },
        { word: 'car', language: 'Spanish', translation: 'coche', status: 'yellow', user_id: 2 },
        { word: 'class', language: 'Spanish', translation: 'clase', status: 'yellow', user_id: 2 },
        { word: 'glass', language: 'Spanish', translation: 'vaso', status: 'yellow', user_id: 3 },
        { word: 'food', language: 'Spanish', translation: 'comida', status: 'yellow', user_id: 3 },
        { word: 'cake', language: 'Spanish', translation: 'pastel', status: 'yellow', user_id: 3 },
      ]);
    });
};
