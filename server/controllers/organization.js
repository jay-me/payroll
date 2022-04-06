const Organization = require('../models/organization');
const Branch = require('../models/branch');

module.exports.getOrganization = async (req,res,next) => {    
    try {

        const result = await Organization.fetchAll();

        res.status(200).json({
            message : "All Organization",
            organization : result.rows
        })
        
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports.postOrganization = async (req,res,next) => {

    const org_name = req.body.org_name;
    const org_city = req.body.org_city;
    const org_country = req.body.org_country;
    const org_address = req.body.org_address;
    const org_user = req.userId;

    
    try {
        const organization = new Organization({
            org_name, org_city, org_country, org_address, org_user
        })

        const result = await organization.save();

        const branch = new Branch({
            organization : result.rows[0].id,
            br_name : "Main Branch",
            br_city : org_city,
            br_country : org_country,
            br_address : org_address,
        })

        const result2 = await branch.save();
        console.log(result2.rows);
        res.status(201).json({
            message : "Organization created successfully!",
            organization : result.rows[0]
        })
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports.putOrganization = async (req,res,next) => {
    const org_name = req.body.org_name;
    const org_city = req.body.org_city;
    const org_country = req.body.org_country;
    const org_address = req.body.org_address;
    const id = req.body.id;
    try {
        const result = await Organization.update({ org_name, org_city, org_country, org_address, id });

        res.status(200).json({
            message : "Organization updated",
            organization : result.rows[0]
        })
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}

module.exports.deleteOrganization = async (req,res,next) => {
    
    const id = req.body.id;

    try {
        await Organization.deleteById(id);
        res.status(200).json({
            message : "Organization deleted"
        })
    } catch (err) {
        if(err.statusCode) err.statusCode = 500;
        next(err);
    }
}