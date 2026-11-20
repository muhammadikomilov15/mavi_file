const Product = require('../models/Product');
const { isDBConnected } = require('../config/db');
const memoryStore = require('../services/memoryStore');

// @desc Get all products with advanced filtering, search, sorting & pagination
// @route GET /api/products
const getProducts = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.getProducts(req, res);
  }

  try {
    const {
      category,
      gender,
      minPrice,
      maxPrice,
      sizes,
      colors,
      inStock,
      isFeatured,
      isNewArrival,
      isBestSeller,
      search,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    // Category filter
    if (category && category !== 'all') {
      if (category === 'men' || category === 'women') {
        query.$or = [{ gender: category }, { gender: 'unisex' }, { category }];
      } else {
        query.category = category.toLowerCase();
      }
    }

    // Gender filter
    if (gender && gender !== 'all') {
      query.$or = [{ gender }, { gender: 'unisex' }];
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sizes filter
    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : sizes.split(',');
      query.sizes = { $in: sizeArray };
    }

    // Colors filter
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : colors.split(',');
      query['colors.name'] = { $in: colorArray.map(c => new RegExp(`^${c}$`, 'i')) };
    }

    // In Stock filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Badge flags
    if (isFeatured === 'true') query.isFeatured = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isBestSeller === 'true') query.isBestSeller = true;

    // Search query
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { 'name.uz': searchRegex },
        { 'name.en': searchRegex },
        { 'name.ru': searchRegex },
        { 'description.uz': searchRegex },
        { 'description.en': searchRegex },
        { 'description.ru': searchRegex },
        { sku: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'popular') sortOption = { salesCount: -1, viewsCount: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: pageNum,
      products
    });
  } catch (error) {
    // If DB error occurs during query, seamlessly fallback to memoryStore
    console.warn('[Products DB Fallback]:', error.message);
    return memoryStore.getProducts(req, res);
  }
};

// @desc Get single product by ID or SKU
// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.getProductById(req, res);
  }

  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ sku: id.toUpperCase() });
    }

    if (!product) {
      // Check memory store as fallback
      return memoryStore.getProductById(req, res);
    }

    // Increment views asynchronously
    product.viewsCount = (product.viewsCount || 0) + 1;
    await product.save({ validateBeforeSave: false }).catch(() => {});

    // Fetch related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    console.warn('[Product Detail DB Fallback]:', error.message);
    return memoryStore.getProductById(req, res);
  }
};

// @desc Create new product (Admin)
// @route POST /api/products
const createProduct = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.createProduct(req, res);
  }

  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update product (Admin)
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.updateProduct(req, res);
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete product (Admin)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.deleteProduct(req, res);
  }

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
