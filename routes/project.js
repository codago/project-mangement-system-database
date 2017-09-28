"use strict";
var express = require('express');
var router = express.Router();
var userChecker = require('../helpers/userChecker')

module.exports = function(db) {
  /* GET home page. */

  router.get('/', userChecker, function(req, res, next) {
    console.log("router(/projects), method(get), req.session: ");
    console.log(req.session);
    let filterQuery = [];
    let isFilter = false;
    let sqlQuery = 'SELECT * FROM projects'

    if(req.query.cid && req.query.id) {
      filterQuery.push(`projectid = ${req.query.id}`)
      isFilter = true;
    }
    if(req.query.cname && req.query.name) {
      filterQuery.push(`name = '${req.query.name}'`)
      isFilter = true;
    }
    if(req.query.cmember && req.query.member) {
      filterQuery.push(`projectid IN(SELECT projectid FROM members WHERE userid = ${req.query.member})`)
      isFilter = true;
    }
    if(isFilter) {
      sqlQuery += ` WHERE ${filterQuery.join(" AND ")}`
    }

      sqlQuery += ' ORDER BY projectid ASC'
    db.query(sqlQuery, function(err, projectsData) {
      if(err) {
        console.err(err);
      }
      var sqlQuery = `SELECT members.projectid,
      users.firstname || ' ' || users.lastname AS name, users.role FROM members,
      users WHERE members.userid=users.userid;`
      db.query(sqlQuery, function(err, membersData) {
        if(err) {
          console.error(err);
        }
        for(let x=0; x<projectsData.rows.length; x++) {
          projectsData.rows[x].members = membersData.rows.filter(function(item) {
            return item.projectid === projectsData.rows[x].projectid;
          });
        }
        db.query("SELECT * FROM users", function(err, userData) {
          if(err) {
            console.err(err);
          }
          console.log(req.session.user);
          res.render('projects/list', { title: 'Express', page: "project", listData: projectsData.rows, userData: userData.rows, projectColumns: JSON.parse(req.session.user.projectcolumns), query: req.query, user: req.session.user });
        });
      });
    });
  });

  router.post('/projectcolumn', userChecker, function(req, res) {
    let projectColumns = JSON.stringify(req.body);
    req.session.user.projectcolumns = projectColumns;
    db.query("UPDATE users SET projectcolumns = $1 WHERE userid = $2", [projectColumns, req.session.user.userid], function(err) {
      if(err) {
        console.error(err);
      }
      res.redirect('/projects')
    });
  });

  router.get('/add', userChecker, function(req, res) {
    db.query("SELECT * FROM users", function(err, userData) {
      if(err) {
        console.error(err);
      }
      res.render('projects/add', {title: 'Add projects', page: "project", userData: userData.rows});
    });
  });

  router.post('/add', userChecker, function(req, res) {
<<<<<<< HEAD
     db.query(`INSERT INTO projects(name) VALUES('${req.body.name}')`, function(err) {
       if(err) {
         console.error(err);
       }
       db.query("SELECT projectid FROM projects ORDER BY projectid DESC LIMIT 1", function(err, projectId) {
         if(err) {
           console.error(err);
         }
         if(req.body.members){
         let insertData = []
         for(var x = 0; x<req.body.members.length; x++) {
           insertData.push(`(${projectId.rows[0].projectid}, ${req.body.members[x]})`)
         }
         db.query(`INSERT INTO members(projectid, userid) VALUES ${insertData.join(',')}`, function(err) {
           if(err) {
             console.error(err);
           }
           res.redirect('/projects');
         });
       }else{
         res.redirect('/projects');
       }
       });
     });
   });
=======
    db.query(`INSERT INTO projects(name) VALUES('${req.body.name}')`, function(err) {
      if(err) {
        console.error(err);
      }
      db.query("SELECT projectid FROM projects ORDER BY projectid DESC LIMIT 1", function(err, projectId) {
        if(err) {
          console.error(err);
        }
        let insertData = []
        for(var x = 0; x<req.body.members.length; x++) {
          insertData.push(`(${projectId.rows[0].projectid}, ${req.body.members[x]})`)
        }
        db.query(`INSERT INTO members(projectid, userid) VALUES ${insertData.join(',')}`, function(err) {
          if(err) {
            console.error(err);
          }
          res.redirect('/projects');
        });
      });
    });
  });
>>>>>>> 96db1580fe7017ab2b8c60fa4632e8ecc3b00085

  router.get('/delete/:id', userChecker, function(req, res) {
    db.query(`DELETE FROM projects WHERE projectid = ${req.params.id}`, function(err) {
      if(err) {
        console.error(err);
      }
      db.query(`DELETE FROM members WHERE projectid = ${req.params.id}`, function(err) {
        if(err) {
          console.error(err);
        }
        res.redirect('/projects');
      });
    });
  });

  router.get('/edit/:id', userChecker, function(req, res) {
    db.query("SELECT * FROM users", function(err, userData) {
      if(err) {
        console.error(err);
      }
      db.query(`SELECT projects.projectid, projects.name, members.userid FROM projects JOIN members ON projects.projectid=members.projectid WHERE projects.projectid= ${req.params.id}`, function(err, data) {
        if(err) {
          console.error(err);
        }
        res.render('projects/edit', {title: "Edit Project", page: "project", data: data.rows, userData: userData.rows, members: data.rows.map(function(item) {return item.userid})})
      });
    })
  });

  router.post('/edit/:id', userChecker, function(req, res) {
    db.query(`UPDATE projects SET name = '${req.body.name}' WHERE projectid = ${req.params.id}`, function(err) {
      if(err) {
        console.error(err)
      }
      db.query(`DELETE FROM members WHERE projectid = ${req.params.id}`, function(err) {
        if(err) {
          console.error(err);
        }
        let insertData = []
<<<<<<< HEAD
          for(var x = 0; x<req.body.members.length; x++) {
          insertData.push(`(${req.params.id}, ${req.body.members[x]})`)
        };
=======
        for(var x = 0; x<req.body.members.length; x++) {
          insertData.push(`(${req.params.id}, ${req.body.members[x]})`)
        }
>>>>>>> 96db1580fe7017ab2b8c60fa4632e8ecc3b00085
        db.query(`INSERT INTO members(projectid, userid) VALUES ${insertData.join(',')}`, function(err) {
          if(err) {
            console.error(err);
          }
          res.redirect('/projects')
        });
      })
    })
  });
  return router;

}
