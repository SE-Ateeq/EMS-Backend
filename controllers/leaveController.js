import Employee from "../models/Employee.js"
import Leave from "../models/Leave.js";

const addLeave = async (req, res) => {
    try {
        const {userId, leaveType, startDate, endDate, reason} = req.body
        const employee = await Employee.findOne({userId})

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        
        const newLeave = new Leave({
            employeeId: employee._id,
            leaveType, 
            startDate, 
            endDate, 
            reason
        })

        await newLeave.save()

        return res.status(200).json({success: true})

    } catch (error) {
        return res.status(500).json({success: false, error: "leave add server error"})
        
    }
}
const getLeave = async (req, res) => {

    try {
        const {id, role} = req.params;
        let leaves
        if(role === "admin") {
             leaves = await Leave.find({employeeId: id})
        } else{
            const employee = await Employee.findOne({userId: id})
            leaves = await Leave.find({employeeId: employee._id})
        }
        return res.status(200).json({success: true, leaves})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, error: "leave add server error"})
        
    }
}

const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate({
            path: "employeeId",
            populate: [
                {
                    path: "department",
                    select: "dep_name"
                },
                {
                    path: "userId",
                    select: "name"
                }
            ]
        })
        // const {id} = req.params;
        // const employee = await Employee.findOne({userId: id})
        // if (!employee) {
        //     return res.status(404).json({ success: false, error: "Employee not found" });
        // }
        // const leaves = await Leave.find({employeeId: employee._id})
        // if (!leaves.length) {
        //     return res.status(404).json({ success: false, error: "No leaves found" });
        // }
        return res.status(200).json({success: true, leaves})
    } catch (error) {
        return res.status(500).json({success: false, error: "leave add server error"})
        
    }
} 

const getLeaveDetail = async (req, res) => {
    try {
        const {id} = req.params;
        const leave = await Leave.findById({_id: id}).populate({
            path: "employeeId",
            populate: [
                {
                    path: "department",
                    select: "dep_name"
                },
                {
                    path: "userId",
                    select: "name profileImage"
                }
            ]
        })

        return res.status(200).json({success: true, leave})
    } catch (error) {
        return res.status(500).json({success: false, error: " Leave detail server error"})
    }
}

const updateLeave = async (req, res) => {
    try {
        const {id} = req.params;
        const leave = await Leave.findByIdAndUpdate({_id: id}, {status: req.body.status})
        if(!leave) {
            return res.status(404).json({success: false, error: " Leave not founded"})
        }
        return res.status(200).json({success: true})
        
    } catch (error) {
        return res.status(500).json({success: false, error: " Leave update server error"})
        
    }
}

export {addLeave, getLeaves, getLeave, getLeaveDetail, updateLeave}