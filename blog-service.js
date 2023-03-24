const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "ardvhdak",
  "ardvhdak",
  "lvS0MjeEJrILbQwQpbj97jlxRrC6HbXa",
  {
    host: "raja.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, { foreignKey: "category" });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to sync the database");
      });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { category: category } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostsByMinDate = function (minDateStr) {
  return new Promise((resolve, reject) => {
    const { gte } = Sequelize.Op;
    Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr),
        },
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostById = function (id) {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { id: id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
    postData.published = postData.published ? true : false;
    for (var i in postData) {
      if (postData[i] == "") postData[i] = null;
    }
    postData.postDate = new Date();

    Post.create(postData)
      .then(() => {
        resolve(console.log("post created successfully"));
      })
      .catch((err) => {
        reject("unable to create post");
      });
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { published: true } })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("No Results Return");
      });
  });
};

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { category: category, published: true } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.addCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    if (categoryData == "") {
      categoryData.category = null;
    }
    Category.create(categoryData)
      .then(() => {
        resolve("create category succesful");
      })
      .catch((err) => {
        reject("unable to create category");
      });
  });
};

module.exports.deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: { id: id },
    })
      .then(() => {
        resolve("destroyed");
      })
      .catch((err) => {
        reject("unable to delete category");
      });
  });
};

module.exports.deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: { id: id },
    })
      .then(() => {
        resolve("destroyed");
      })
      .catch((err) => {
        reject("unable to delete post");
      });
  });
};