
exports.up = function(knex, Promise) {
    return knex.schema.createTable("words", (table) => {
        table.increments();
        table.string("word");
        table.string("language");
        table.string("translation");
        table.integer("status");
        table.integer("count");
        table.integer("user_id")
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .index();
        table.timestamps(true, true);
    }) 
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("words");
};
