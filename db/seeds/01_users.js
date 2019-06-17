
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {name: 'Shirley Ramirez', email: 'shirley@yahoo.com', password: 'yahoo'},
        {name: 'Katie Berg', email: 'katie@yahoo.com', password: 'yabaa'},
        {name: 'Jane Smith', email: 'jane@yahoo.com', password: 'google'}
      ]);
    });
};
