const controller = {};
const models = require("../models");
const { Op } = require('sequelize');

controller.showList = async(req, res) => {

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 4;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const categoryId = req.query.category;
    const tagId = req.query.tag;
    const keyword = req.query.keyword;

    let countOptions = {};

    if (keyword !== undefined) {
    res.locals.blogs = await models.Blog.findAll({
        limit: limit,
        offset: offset,
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [{ model: models.Comment }],
        where: {
            title: {
                [Op.like]: '%' + keyword + '%'
            }
        }
    });
    countOptions = {
        where: {
            title: {
                [Op.like]: '%' + keyword + '%'
            }
        }
    };
    }
    else if (categoryId !== undefined) {
    res.locals.blogs = await models.Blog.findAll({
        limit: limit,
        offset: offset,
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [{ model: models.Comment }],
        where: {
            categoryId: categoryId
        },
    });
    countOptions = {
        where: {
            categoryId: categoryId
        }
    };
    } else if (tagId !== undefined) {
    res.locals.blogs = await models.Blog.findAll({
        limit: limit,
        offset: offset,
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [{ model: models.Comment }],
        include: [{ 
            model: models.Tag,
            where: {
                id: tagId
            }
        }],
    });
    countOptions = {
        include: [{ 
            model: models.Tag,
            where: {
                id: tagId
            }
        }]
    };
    } else {
    res.locals.blogs = await models.Blog.findAll({
        limit: limit,
        offset: offset,
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [{ model: models.Comment }],
    });
    countOptions = {};
    }

    const totalBlogs = await models.Blog.count(countOptions);

    const totalPages = Math.ceil(totalBlogs / pageSize);
    const previous = page > 1 ? page - 1 : null;
    const next = page < totalPages ? page + 1 : null;

    res.locals.pagination = {
        page: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalBlogs: totalBlogs,
        previous: previous,
        next: next
    };
    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name"],
        include: [{ model: models.Blog }],
    });
    res.locals.tags = await models.Tag.findAll({
        attributes: ["id", "name"],
    });
    res.render("index");
};

controller.showDetails = async(req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    res.locals.blog = await models.Blog.findOne({
        attributes: ["id", "title", "description", "createdAt"],
        where: { id: id },
        include: [
            { model: models.Category },
            { model: models.User },
            { model: models.Tag },
            { model: models.Comment },
        ]
    });
    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name"],
        include: [{ model: models.Blog }],
    });
    res.locals.tags = await models.Tag.findAll({
        attributes: ["id", "name"],
    });
    res.render("details");
};

module.exports = controller;