MDS.init(function (msg) {
  if (msg.event === 'inited') {
    // create schema
    MDS.sql('CREATE TABLE IF NOT EXISTS logs (id bigint auto_increment,message varchar(2048) NOT NULL)');
  } else if (msg.event === 'MINIMALOG') {
    // insert logs into the logs table
    MDS.sql(`INSERT INTO logs (message) VALUES ('${msg.data.message.replace(/'/g, "\'")}')`, function () {
      // delete everything but the latest 500 logs if there is more than 500
      MDS.sql('SELECT COUNT(*) FROM logs', function (response) {
        if (response.rows.length > 0) {
          var count = Number(response.rows[0]['COUNT(*)']);

          if (count > 500) {
            MDS.sql('DELETE FROM logs WHERE id NOT IN (SELECT id FROM logs ORDER BY id DESC LIMIT 500)');
          }
        }
      });
    });
  }
});
