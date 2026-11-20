const Category = require('../models/Category');
const { isDBConnected } = require('../config/db');
const memoryStore = require('../services/memoryStore');

// @desc Get all categories
// @route GET /api/categories
const getCategories = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.getCategories(req, res);
  }

  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.warn('[Categories DB Fallback]:', error.message);
    return memoryStore.getCategories(req, res);
  }
};

// @desc Create category (Admin)
// @route POST /api/categories
const createCategory = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.createCategory(req, res);
  }

  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update category (Admin)
// @route PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.updateCategory(req, res);
  }

  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete category (Admin)
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.deleteCategory(req, res);
  }

  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Category deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
