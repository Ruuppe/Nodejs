'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password: '',
  database: 'asiakas'
});

module.exports =
{
  fetchTypes: function (req, res) {
    connection.query('SELECT avain, lyhenne, selite FROM asiakastyyppi', function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa asiakastyyppi-taulusta, syy: " + error);
        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.json(results);
      }
    });
  },

  fetchAll: function (req, res) {
    var sql = 'SELECT avain, nimi, osoite, postinro, postitmp, DATE_FORMAT(luontipvm, "%Y-%m-%d") as luontipvm, asty_avain FROM asiakas WHERE nimi LIKE ? AND osoite LIKE ?';
    var reqnimi = req.query.nimi;
    var reqosoite = req.query.osoite;
    var reqasty = req.query.asty_avain;

    if (reqnimi == null) {
      reqnimi = "";
    }
    if (reqosoite == null) {
      reqosoite = "";
    }
    if (reqasty == null) {
      reqasty = "";
    }
    if (reqasty != "") {
      sql = sql + ' AND asty_avain = ?';
    }

    connection.query(sql, [reqnimi + "%", reqosoite + "%", reqasty], function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa asiakas-taulusta, syy: " + error);
        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        console.log("Params = " + JSON.stringify(req.query));
        res.json(results);
      }
    });
  },

  create: function (req, res) {
    connection.query('INSERT INTO asiakas (nimi, osoite, postinro, postitmp, luontipvm, asty_avain) VALUES (?, ?, ?, ?, CURDATE(), ?)',
      [req.body.nimi, req.body.osoite, req.body.postinro, req.body.postitmp, req.body.asty_avain], function (error, results, fields) {
        if (error) {
          console.log("Virhe lisättäessä dataa asiakas-tauluun, syy: " + error);
          res.send(error);
        }
        else {
          console.log("Params = " + JSON.stringify(req.body));
          res.send("Kutsuttiin create");
        }
      });
  },

  update: function (req, res) {

  },

  delete: function (req, res) {
    connection.query('DELETE FROM asiakas WHERE avain=?', [req.params.id], function (error, results, fields) {
      if (error) {
        console.log("Virhe poistettaessa dataa asiakas-taulusta, syy: " + error);
        res.send(error);
      }
      else {
        console.log("Params = " + JSON.stringify(req.params));
        res.send("Kutsuttiin delete");
      }
    });
  }
}
