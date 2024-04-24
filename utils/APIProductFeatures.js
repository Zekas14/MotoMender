// const Product = require("../Models/productModel");
class APIProductFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    // this.model = Product;
  }
  filterObj() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      / \bgte|lte|gt|lt|ne|eq|in|nin\b/g,
      (match) => `$${match}`
    );
    return JSON.parse(queryStr);
  }
  filter() {
    this.query = this.query.find(this.filterObj());
    return this;
  }
  sort(defaultSort = "ratingAverage") {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(`${defaultSort}`);
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  // count() {
  //   return this.model.countDocuments(this.filterObj());
  // }
}
module.exports = APIProductFeatures;
