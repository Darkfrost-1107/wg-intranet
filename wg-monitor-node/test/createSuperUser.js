require('../src/utils/database.service');

db.CreateSuperUser({
  username: "admin",
  password: "admin123"
})