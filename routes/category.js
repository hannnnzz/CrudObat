var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;

router.get("/tabletkeras", authentication_mdl.is_login, function (req, res, next) {
    req.getConnection(function (err, connection) {
        var query = connection.query(
            "SELECT * FROM drug WHERE Kategori = 'tablet keras'",
            function (err, rows) {
                if (err) var errornya = ("Error Selecting : %s ", err);
                req.flash("msg_error", errornya);
                res.render("drug/new", {
                    title: "Drugs",
                    data: rows,
                    session_store: req.session,
                });
            }
        );
        //console.log(query.sql);
    });
});

router.get("/syrupkeras", authentication_mdl.is_login, function (req, res, next) {
    req.getConnection(function (err, connection) {
        var query = connection.query(
            "SELECT * FROM drug WHERE Kategori = 'syrup keras'",
            function (err, rows) {
                if (err) var errornya = ("Error Selecting : %s ", err);
                req.flash("msg_error", errornya);
                res.render("drug/new", {
                    title: "Drugs",
                    data: rows,
                    session_store: req.session,
                });
            }
        );
        //console.log(query.sql);
    });
});

router.get("/generik", authentication_mdl.is_login, function (req, res, next) {
    req.getConnection(function (err, connection) {
        var query = connection.query(
            "SELECT * FROM drug WHERE Kategori = 'generik'",
            function (err, rows) {
                if (err) var errornya = ("Error Selecting : %s ", err);
                req.flash("msg_error", errornya);
                res.render("drug/new", {
                    title: "Drugs",
                    data: rows,
                    session_store: req.session,
                });
            }
        );
        //console.log(query.sql);
    });
});

module.exports = router;