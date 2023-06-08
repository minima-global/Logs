MDS.init(function (msg) {
  if (msg.event === 'inited') {

    // create schema
    MDS.sql('CREATE TABLE IF NOT EXISTS logs (id bigint auto_increment,message varchar(2048) NOT NULL,timestamp TIMESTAMP)');
  } else if (msg.event === 'MINIMALOG') {
    var encoded = encodeURIComponent(msg.data.message).replace(/'/g, "%27");

    // insert logs into the logs table
    MDS.sql(`INSERT INTO logs (message,timestamp) VALUES ('${encoded}',CURRENT_TIMESTAMP)`, function (response) {

      if (response.status) {

        // delete everything more than 7 days old
        // 604800 is 7 days
        MDS.sql('DELETE FROM logs WHERE timestamp <= CURRENT_TIMESTAMP - 604800');
      }
    });
  }
});
