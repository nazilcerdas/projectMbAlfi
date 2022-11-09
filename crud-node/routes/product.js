var express = require('express')
var app = express()
var db = require('../config');
var mysql = require('mysql');


//create connection database
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'node-crud'
});

//create connection
connection.connect();

// List Product
app.get('/', function(req, res, next) {
        
    // select query get data product list    
    selectQuery = "SELECT * FROM products ORDER BY id DESC";

    connection.query(selectQuery, function(error,data){

        //if(err) throw err
        if (error) {
            req.flash('error', error)
            res.render('product/list', {
                title: 'Product List', 
                data: ''
            })
        } else {
            // render to views/product/list.ejs template file
            res.render('product/list', {
                title: 'Product List', 
                data: data
            })
        }
    })
})

// Add Product Form
app.get('/add', function(req, res, next){   
    // render to views/product/add.ejs
    res.render('product/add', {
        title: 'Add New Product',
        name: '',
        price: '',
        detail: ''      
    })
})

// Add Product Data
app.post("/add", function(req, res, next){

    // add validation
    req.assert('name', 'Name field is required').notEmpty()      //Validate name
    req.assert('price', 'Price field is required').notEmpty()    //Validate price
    req.assert('detail', 'Detail field is required').notEmpty()  //Validate detail

    var errors = req.validationErrors()

    if(errors){

        var error_msg = ''

        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })              

        req.flash('error', error_msg)       
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('product/add', { 
            title: 'Add New Product',
            name: req.body.name,
            price: req.body.price,
            detail: req.body.detail
        })
    }else{
        //get data in form  
        var name = req.body.name;
        var price = req.body.price;
        var detail = req.body.detail;

        // insert query get data product
        insertQuery = `INSERT INTO products (name,price,detail) VALUES ("${name}", "${price}", "${detail}")`;

        connection.query(insertQuery, function(error,result){

            req.flash('success', 'Product add successfully!')
            // redirect to product list page
            res.redirect('/products')

        });
    }
});

// Edit Product
app.get('/edit/(:id)', function(req, res, next){

    // get id product
    var id = req.params.id;

    //select query select data edit form
    var selectQuery = `SELECT * FROM products WHERE id = "${id}"`;

    connection.query(selectQuery, function(error, data){

        // render to views/product/edit.ejs template file
        res.render('product/edit', {
            title: 'Edit Product', 
            //data: rows[0],
            id: data[0].id,
            name: data[0].name,
            price: data[0].price,
            detail: data[0].detail                    
        })

    });

});

// Update Product
app.post('/edit/(:id)', function(req, res, next){

    // get id product
    var id = req.params.id;

    // add validation
    req.assert('name', 'Name field is required').notEmpty()      //Validate name
    req.assert('price', 'Price field is required').notEmpty()    //Validate price
    req.assert('detail', 'Detail field is required').notEmpty()  //Validate detail

    var errors = req.validationErrors()

    if(errors){

        var error_msg = ''

        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })              

        req.flash('error', error_msg)       
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('product/edit', { 
            title: 'Add New Product',
            id: id,
            name: req.body.name,
            price: req.body.price,
            detail: req.body.detail
        })

    }else{

        // get data product
        var id = req.params.id;
        var name = req.body.name;
        var price = req.body.price;
        var detail = req.body.detail;

        // update query product update
        var updateQuery = `UPDATE products SET name = "${name}", price = "${price}", detail = "${detail}" WHERE id = "${id}"`;

        connection.query(updateQuery, function(error,result){

            req.flash('success', 'Product update successfully!')
            // redirect to products list page
            res.redirect('/products')
        });
    }

})

// Delete Product
app.delete('/delete/(:id)', function(req, res, next) {

    // get id product data
    var id = req.params.id;

    // delete query product delete
    deleteQuery = `DELETE FROM products WHERE id = "${id}"`;

    connection.query(deleteQuery, function(error,data){
        //if(err) throw err
        if (error) {
            req.flash('error', error)
            // redirect to products list page
            res.redirect('/products')
        } else {
            req.flash('success', 'Product deleted successfully!')
            // redirect to products list page
            res.redirect('/products')
        }
    })
})

module.exports = app