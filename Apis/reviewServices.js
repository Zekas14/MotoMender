const Review = require('../Models/Review');
//get All Comments 
const getAllComments = async (req,res) => {
    try {
        const comments = await Review.find();
        res.status(200).json(comments)
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({
            message : error
        })
    }
}
// Add a Comment :
const addComment = async (req, res) => {
    try {
        let review = new Review(req.body)
        await review.save();
    res.status(200).json({
        message: 'Comment added successfully'
    });
    
    } catch (error) {
        console.error(error);
        res.status(200).json({
            message: error
        });
            
    }
}
// Delete A comment :
 const deleteComment = async (req,res)=> {
    try {
        await Review.findByIdAndDelete(req.params.commentId);
        res.status(200).json({
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        
        console.error(error);
        res.status(500).json({
            message : error
        })
    }
 }
 //Edit Comment : 
    const editComment = async (req,res)=>{
        try {
            await Review.findByIdAndUpdate(req.params.commentId,{content: req.body.content} );
            res.status(200).json({
                message: 'Comment edited successfully'
            });
    }
    catch(error){
        res.status(500).json({
            message : error
        })
    }
    }
module.exports = {
    addComment,
    deleteComment,
    getAllComments,
    editComment
}
