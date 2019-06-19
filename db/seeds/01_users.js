
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {name: 'Shirley Ramirez', email: 'shirley@yahoo.com', password: 'yahoo', language: 'es'},
        {name: 'Katie Berg', email: 'katie@yahoo.com', password: 'yabaa', language: 'es'},
        {name: 'Jane Smith', email: 'jane@yahoo.com', password: 'google', language: 'es'}
      ]);
    });
};
