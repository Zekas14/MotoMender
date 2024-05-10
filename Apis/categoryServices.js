const Category = require("../Models/Category");
exports.createCategory = async(req , res) =>{
    try {
        const category = await Category.create(req.body);
        res.status(200).json({
            status: 200,
            category
        })
    }catch(error) {
        res.status(400).json({
            status: 400,
            message: error.message  
        })
    }
}
exports.getAllCategories = async(req,res)=>{
    try {
        const categories = await Category.find();
        res.status(200).json({
            status: 200,
            categories
        })
    }catch{
        res.status(400).json({
            status: 400,
            message: error.message  
        })
    }
}
exports.getOneCategory= async (req,res)=>{
    try {
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({
                status: 404,
                message: "Category not found"
            });
        }
        res.status(200).json({
            status: 200,
            category
        });
    }catch(error){
        res.status(400).json({
            status: 400,
            message: error.message  
    });
}
}
exports.updateCategory = async (req,res)=>{
    try {
        const category = await Category.findByIdAndUpdate(req.params.id,{name : req.body.name});
        if(!category){
            return res.status(404).json({
                status: 404,
                message: "Category not found"
            });
        }
        res.status(200).json({
            status: 200,
            category
        });
    }catch(error){
        res.status(400).json({
            status: 400,
            message: error.message  
    });  
    } 
}