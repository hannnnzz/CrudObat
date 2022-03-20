var express = require("express");
var router = express.Router();
var http = require("http");
var fs = require("fs");
var fileUpload = require('express-fileupload');
var path = require('path');
var formidable = require("formidable");
var mv = require("mv");
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Drug page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM drug",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("drug/list", {
          title: "Drugs",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.get("/info/(:id)", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM drug where id=" + req.params.id,
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("drug/uyeye", {
          title: "Drugs Info",
          data: rows[0],
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var drug = {
        id: req.params.id,
      };

      var delete_sql = "delete from drug where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          drug,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/drugs");
            } else {
              req.flash("msg_info", "Delete Drug Success");
              res.redirect("/drugs");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM drug where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/drugs");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Drug can't be find!");
              res.redirect("/drugs");
            } else {
              console.log(rows);
              res.render("drug/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Tolong Masukkan Nama").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_kode = req.sanitize("kode").escape().trim();
      v_kategori = req.sanitize("kategori").escape().trim();
      v_produsen = req.sanitize("produsen").escape().trim();
      v_distributor = req.sanitize("distributor").escape().trim();
      v_stok = req.sanitize("stok").escape();

      if (!req.files) {
        var drug = {
        nama: v_nama,
        kode: v_kode,
        kategori: v_kategori,
        produsen: v_produsen,
        distributor: v_distributor,
        stok: v_stok,
        };
      }else{
        var file = req.files.gambar;
        var gambar = file.name;
        file.mimetype == "image/jpeg";
        file.mv("public/images/upload/" + gambar);

      var drug = {
        nama: v_nama,
        kode: v_kode,
        kategori: v_kategori,
        produsen: v_produsen,
        distributor: v_distributor,
        stok: v_stok,
        gambar: gambar,
      };
    }

      var update_sql = "update drug SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          drug,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("drug/edit", {
                nama: req.param("nama"),
                kode: req.param("kode"),
                kategori: req.param("kategori"),
                produsen: req.param("produsen"),
                distributor: req.param("distributor"),
                stok: req.param("stok"),
              });
            } else {
              req.flash("msg_info", "Update drug success");
              res.redirect("/drugs");
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/drugs/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {

  req.assert("nama", "Please Fill The Name").notEmpty();
  req.assert("kode", "Please Fill The Code").notEmpty();
  req.assert("kategori", "Please Fill The Category").notEmpty();
  req.assert("produsen", "Please Fill The Producent").notEmpty();
  req.assert("stok", "Please Fill The Stock").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_kode = req.sanitize("kode").escape().trim();
    v_kategori = req.sanitize("kategori").escape().trim();
    v_produsen = req.sanitize("produsen").escape().trim();
    v_distributor = req.sanitize("distributor").escape().trim();
    v_stok = req.sanitize("stok").escape().trim();

    var file = req.files.gambar;
    var gambar = file.name;
    file.mimetype == "image/jpeg";
    file.mv("public/images/upload/" + gambar);

    var drug = {
      nama: v_nama,
      kode: v_kode,
      kategori: v_kategori,
      produsen: v_produsen,
      distributor: v_distributor,
      stok: v_stok,
      gambar: gambar,
    };

    var insert_sql = "INSERT INTO drug SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        drug,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("drug/add-drug", {
              nama: req.param("nama"),
              kode: req.param("kode"),
              kategori: req.param("kategori"),
              produsen: req.param("produsen"),
              distributor: req.param("distributor"),
              stok: req.param("stok"),
              gambar:req.param("gambar"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create drug success");
            res.redirect("/drugs");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sorry There Are Error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("drug/add-drug", {
      nama: req.param("nama"),
      kode: req.param("kode"),
      kategori: req.param("kategori"),
      produsen: req.param("produsen"),
      distributor: req.param("distributor"),
      stok: req.param("stok"),
      gambar:req.param("gambar"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("drug/add-drug", {
    title: "Add New Drug",
    nama: "",
    kode: "",
    kategori: "",
    produsen: "",
    distributor: "",
    stok: "",
    gambar: "",
    session_store: req.session,
  });
});

module.exports = router;
