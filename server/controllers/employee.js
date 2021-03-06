const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Employee = require('../models/employee');
const User = require('../models/user');
const Activity = require('../models/activity');
const {SECRET_KEY} = require('../util/config');

module.exports.getEmployee = async (req,res,next) => {
    
    const orgId = req.params.orgId;
    try {  
        const result = await Employee.fetchAllByOrg(orgId);
        res.status(200).json({
            message : "All emplyoees",
            employees : result.rows
        })
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports.getCurrentEmployessDetails = async (req, res, next) =>{
    const empId = req.employeeId;
    const userId = req.userId;
    try {
        let result;
        if(empId){
            result =  await Employee.getEmployeeProfile(empId);
            // console.log(result.rows);
        }
        if(userId){
            result = await User.find('id',userId);
            // console.log(result.rows);
        }
        res.status(200).json({
            message : "User's details",
            details : result.rows[0],
            // isAdmin : req.isAdmin ? true : false // PENDING,
            isUser : req.userId ? true : false
        })
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports.getEmployeeProfile = async (req,res,next) => {

    const empId = req.params.empId;

    try {
        const result =  await Employee.getEmployeeProfile(empId);
        res.status(200).json({
            message : "Employee's details",
            details : result.rows[0],
            isAdmin : result.rows[0].permissions === 'c40441eb-06ae-4b67-8cd4-fc15ced1a94e'
        })
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}


module.exports.putMakAdmin = async (req, res, next) => {
    
    const empId = req.params.empId;

    try {
        const result = await Employee.makeAdmin(empId);
        res.status(200).json({
            message : "Successfully made this employee an Admin"
        });

        const activity = new Activity({
            type : "Made Admin",
            message : "You are now Admin",
            employee : empId
        })

        await activity.save();
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}  

module.exports.postEmployee = async (req,res,next) => {

    const e_fname = req.body.e_fname;
    const e_lname = req.body.e_lname;
    const e_email = req.body.e_email;
    const e_password = req.body.e_password;
    const e_gender = req.body.e_gender;
    const e_age = req.body.e_age;
    const join_date = req.body.join_date;
    const payout_time = req.body.payout_time;
    const e_salary_per_year = req.body.e_salary_per_year;
    const department = req.body.department;
    const branch = req.body.branch;
    const permissions = req.body.permissions;
    const organization = req.body.organization;
    console.log(req.body);
    // return;
    // 1. input validation
    try {
        // 2. check email alreadly exists
        let result = await Employee.findInOrganization('e_email' , e_email, organization);

        if(result.rows.length === 1) {
            const err = new Error('Emplyoee already exists');
            err.statusCode = 422;
            throw err;
        }
            
        // 3. hash password
        const hashPass = await bcrypt.hash(e_password , 12);
        
        // 4. add employee
        const employee = new Employee({
            e_fname : e_fname,
            e_lname : e_lname,
            e_email : e_email,
            e_password : hashPass,
            e_gender : e_gender,
            e_age : e_age,
            join_date : join_date,
            payout_time : payout_time,
            e_salary_per_year : e_salary_per_year,
            department : department,
            branch : branch,
            permissions : permissions,
            organization : organization,
        })
        
        result = await employee.save();
        const createdEmp = result.rows[0];

        // 5. send authenication token with response
        const token = jwt.sign(
            {
                employeeId : createdEmp.id,
                permissionId : createdEmp.permissions,
                organizationId : createdEmp.organization,
                email : createdEmp.e_email
            },
            SECRET_KEY
        );
        createdEmp.token = token;

        res.status(201).json({
            message : "successfully sign up!",
            employee : createdEmp
        })

        const activity = new Activity({
            type : "Created Account",
            message : "You are now added in organization",
            employee : createdEmp.id
        })

        await activity.save();
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}


module.exports.loginEmployee = async (req,res,next) => {
    const e_email = req.body.e_email;
    const e_password = req.body.e_password;
    const organization = req.body.organization;
    
    try {
        // 1. Check if emplyoee exists or not
        const result = await Employee.findInOrganization('e_email' , e_email, organization);
        if(result.rows.length === 0){
            const err = new Error("Employee not found for this organization");
            err.statusCode = 401;
            throw err;
        }
        const employee = result.rows[0];
        // 2. If exists then check password is valid or not
        const isMatch = await bcrypt.compare(e_password , employee.e_password);

        if(!isMatch){
            const err = new Error("Invalid email or password");
            err.statusCode = 401;
            throw err;
        }
        // 3. If password is valid then send auth token in response
        const token = jwt.sign({
            employeeId : employee.id,
            permissionId : employee.permissions,
            organizationId : employee.organization,
            email : employee.e_email
        } , SECRET_KEY);

        employee.token = token;

        return res.status(200).json({
            message : "Logged in successfully!",
            employee : employee
        })

    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}


module.exports.putEmployee = async (req,res,next) => {
    
    const id = req.body.id;
    const e_fname = req.body.e_fname;
    const e_lname = req.body.e_lname;
    const e_email = req.body.e_email;
    const e_gender = req.body.e_gender;
    const e_age = req.body.e_age;
    const join_date = req.body.join_date;
    const e_salary_per_year = req.body.e_salary_per_year;
    const department = req.body.department;
    const branch = req.body.branch;
    
    // 1. input validation
    try {
        // 2. update employee
        const result = await Employee.update({
            id : id,
            e_fname : e_fname,
            e_lname : e_lname,
            e_email : e_email,
            e_gender : e_gender,
            e_age : e_age,
            join_date : join_date,
            e_salary_per_year : e_salary_per_year,
            department : department,
            branch : branch
        });

        const updatedEmployee = result.rows[0];

        // 3. send back updated employee
        res.status(200).json({
            message : "Employee updated",
            employee : updatedEmployee
        })

        const activity = new Activity({
            type : "Account Updated",
            message : "You are now added in organization",
            employee : updatedEmployee.id
        })

        await activity.save();

    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports.deleteEmployee = async (req,res,next) => {

    const id = req.body.id;
    try {
        // 1. delete from database
        const result = await Employee.deleteById(id);
        
        // 2. send response for it
        return res.status(200).json({
            message : "Employee deleted!"
        })
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}