const Voucher = require('../Models/Voucher');
const User = require("../Models/User");

exports.addVoucher =async (req, res) => {
    try {
      const voucher = new Voucher(req.body);
      await voucher.save();
      res.status(200).json({
        status : 200,
        data : voucher
    });
    } catch (error) {
      res.status(500).send(error);
    }
}
exports.getAllVouchers = async(req,res)=>{
    try {
        const vouchers = await Voucher.find();
        res.status(200).json({
            status : 200,
            data : vouchers
        }
        );
    }catch(error){
        res.status(500).json({
            status : 500,
            message : error.message
        });
    }
}
exports.deleteVoucher = async (req,res)=>{ 
    try {
        const voucher = await Voucher.findByIdAndDelete(req.params.id);
        if (!voucher){
            return res.status(404).json({ message: 'Voucher not found' });
        }
        res.status(200).json({
            status : 200,
            message :"Voucher Deleted Suceesfully"
        })
        }
        catch(error){
            res.statu(500).json({
                status :500,
                message : error.message
            });
        }
}
exports.redeemVoucher = async (req, res) => {
    try {
      const { code, userId , totalPrice } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      const voucher = await Voucher.findOne({ code });
      if (!voucher) {
        return res.status(404).send({ message: 'Voucher not found' });
      }
      if (voucher.usedBy.includes(user._id)) {
        return res.status(400).send({ message: 'Voucher has already been used by this user' });
      }
      if (voucher.usedBy.length >= voucher.maxUsage) {
        return res.status(400).send({ message: 'Voucher has reached its maximum usage limit' });
      }
      if (voucher.validUntil < new Date()) {
        return res.status(400).send({ message: 'Voucher has expired' });
      }
      const totalAmount = totalPrice -(totalPrice*voucher.discount)
      voucher.usedBy.push(user._id); 
      await voucher.save();
      res.status(200).json({ 
        status : 200,
        message: 'Voucher redeemed successfully',
        data : totalAmount
     });
    } catch (error) {
      res.status(500).send(error);
    }
}