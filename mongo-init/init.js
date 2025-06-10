// Create admin user and database
db.getSiblingDB("admin").runCommand({
  createUser: "admin",
  pwd: "admin",
  roles: [{
    role: "root",
    db: "admin"
  }]
});

// Create application database
db.getSiblingDB("taskdb");

// Grant admin access to taskdb
db.getSiblingDB("taskdb").runCommand({
  grantRolesToUser: "admin",
  roles: [{
    role: "readWrite",
    db: "taskdb"
  }]
});

// Create initial collection (triggers DB creation)
db.getSiblingDB("taskdb").createCollection("tasks");
