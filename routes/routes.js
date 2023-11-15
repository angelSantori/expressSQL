const sql = require('mssql');


const router = app => {
    //Mostrar mensaje de bienvenida en root
    app.get('/', (request, response) => {
        response.send({
            message: 'Bienvenido a Node.js Express REST API con MSSQL'
        });
    });

    //Mostrar todos los usuarios
    app.get('/users', async (request, response) => {
        try {
            const pool = await sql.connect('./data/config');
            const result = await pool.request().query('SELECT * FROM users');
            response.send(result.recordset);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Mostrar un solo usuario por ID
    app.get('/users/:id', async (request, response) => {
        const id = request.params.id;

        try {
            const pool = await sql.connect('./data/config');
            const result = await pool
                .request()
                .input('id', sql.Int, id) // Declarar el parámetro @id
                .query('SELECT * FROM users WHERE idusers = @id');
            
            response.send(result.recordset);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    //Agregar un nuevo usuario
    app.post('/users', async (request, response) => {
        const newUser = request.body;

        try {
            const pool = await sql.connect('./data/config');

            const request = pool.request();
            
            // Asignar parámetros individualmente
            request.input('userNombre', sql.VarChar(45), newUser.userNombre);
            request.input('userEdad', sql.Int, newUser.userEdad);
            request.input('userEmail', sql.VarChar(320), newUser.userEmail);
            request.input('userPass', sql.VarChar(128), newUser.userPass);

            const result = await request.query('INSERT INTO users (userNombre, userEdad, userEmail, userPass) OUTPUT INSERTED.idusers VALUES (@userNombre, @userEdad, @userEmail, @userPass)');

            const insertId = result.recordset[0].idusers;

            response.status(201).send(`User added with ID: ${insertId}`);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Ejemplo de petición POST
    // {
    //     "userNombre": "jorge",
    //     "userEdad": 33,
    //     "userEmail": "jorge@email.com",
    //     "userPass": "contraseña"
    // }

    // Actualizar un usuario existente
    app.put('/users/:id', async (request, response) => {
        try {
            const id = request.params.id;
            const newUser = request.body;

            const pool = await sql.connect('./data/config');

            const result = await pool
                .request()
                .input('idusers', sql.Int, id)
                .input('userNombre', sql.VarChar(45), newUser.userNombre)
                .input('userEdad', sql.Int, newUser.userEdad)
                .input('userEmail', sql.VarChar(320), newUser.userEmail)
                .input('userPass', sql.VarChar(128), newUser.userPass)
                .query('UPDATE users SET userNombre = @userNombre, userEdad = @userEdad, userEmail = @userEmail, userPass = @userPass WHERE idusers = @idusers');

            response.send('User updated successfully');
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Eliminar un usuario
    app.delete('/users/:id', async (request, response) => {
        const id = request.params.id;

        try {
            const pool = await sql.connect('./data/config');

            const result = await pool
                .request()
                .input('id', sql.Int, id)
                .query('DELETE FROM users WHERE idusers = @id');

            response.send('User deleted');
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });
    
    //-----------------------------------------------------------------------------------------------------------------------Productos
    //Mostrar todos los productos
    app.get('/products', async (request, response) => {
        try {
            const pool = await sql.connect('./data/config');
            const result = await pool.request().query('SELECT * FROM products');
            response.send(result.recordset);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Mostrar un solo producto por ID
    app.get('/products/:id', async (request, response) => {
        const id = request.params.id;

        try {
            const pool = await sql.connect('./data/config');
            const result = await pool
                .request()
                .input('id', sql.Int, id) // Declarar el parámetro @id
                .query('SELECT * FROM products WHERE idproduct = @id');
            
            response.send(result.recordset);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    //Agregar un nuevo usuario
    app.post('/products', async (request, response) => {
        const newProduct = request.body;

        try {
            const pool = await sql.connect('./data/config');

            const request = pool.request();
            
            // Asignar parámetros individualmente
            request.input('productNombre', sql.VarChar(45), newProduct.productNombre);
            request.input('productDescription', sql.VarChar(320), newProduct.productDescription);
            request.input('productPrecio', sql.Float, newProduct.productPrecio);
            request.input('productExistencias', sql.Int, newProduct.productExistencias);                        
            
            const result = await request.query('INSERT INTO products (productNombre, productDescription, productPrecio, productExistencias) OUTPUT INSERTED.idproduct VALUES (@productNombre, @productDescription, @productPrecio, @productExistencias)');

            const insertId = result.recordset[0].idproduct;

            response.status(201).send(`Product added with ID: ${insertId}`);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Actualizar un producto existente
    app.put('/products/:id', async (request, response) => {
        try {
            const id = request.params.id;
            const newProduct = request.body;

            const pool = await sql.connect('./data/config');

            const result = await pool
                .request()
                .input('idproduct', sql.Int, id)
                .input('productNombre', sql.VarChar(45), newProduct.productNombre)
                .input('productDescription', sql.VarChar(320), newProduct.productDescription)
                .input('productPrecio', sql.Float, newProduct.productPrecio)
                .input('productExistencias', sql.Int, newProduct.productExistencias)

                .query('UPDATE products SET productNombre = @productNombre, productDescription = @productDescription, productPrecio = @productPrecio, productExistencias = @productExistencias WHERE idproduct = @idproduct');

            response.send('Product updated successfully');
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Eliminar un producto
    app.delete('/products/:id', async (request, response) => {
        const id = request.params.id;

        try {
            const pool = await sql.connect('./data/config');

            const result = await pool
                .request()
                .input('id', sql.Int, id)
                .query('DELETE FROM products WHERE idproduct = @id');

            response.send('Product deleted');
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });
    //-----------------------------------------------------------------------------------------------------------------------/Productos

    //-----------------------------------------------------------------------------------------------------------------------Ventas
    //Mostrar todas las ventas
    app.get('/ventas', async (request, response) => {
        try {
            const pool = await sql.connect('./data/config');
            const result = await pool.request().query('SELECT * FROM ventas');
            response.send(result.recordset);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Mostrar una sola venta por ID
    app.get('/ventas/:id', async (request, response) => {
        const id = request.params.id;

        try {
            const pool = await sql.connect('./data/config');
            const result = await pool
                .request()
                .input('id', sql.Int, id) // Declarar el parámetro @id
                .query('SELECT * FROM ventas WHERE idventa = @id');
            
            response.send(result.recordset);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    //Agregar un nuevo usuario
    app.post('/ventas', async (request, response) => {
        const newVenta = request.body;

        try {
            const pool = await sql.connect('./data/config');

            const request = pool.request();
            
            // Asignar parámetros individualmente
            request.input('idusers', sql.Int, newVenta.idusers);
            request.input('idproduct', sql.Int, newVenta.idproduct);
            request.input('ventaTotal', sql.Float, newVenta.ventaTotal);
            request.input('ventaTipoPago', sql.VarChar(45), newVenta.ventaTipoPago);            
            
            const result = await request.query('INSERT INTO ventas (idusers, idproduct, ventaTotal, ventaTipoPago) OUTPUT INSERTED.idventa VALUES (@idusers, @idproduct, @ventaTotal, @ventaTipoPago)');

            const insertId = result.recordset[0].idventa;

            response.status(201).send(`Venta added with ID: ${insertId}`);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Actualizar una venta existente
    app.put('/ventas/:id', async (request, response) => {
        try {
            const id = request.params.id;
            const newVenta = request.body;

            const pool = await sql.connect('./data/config');

            const result = await pool
                .request()
                .input('idventa', sql.Int, id)
                .input('idusers', sql.Int, newVenta.idusers)
                .input('idproduct', sql.Int, newVenta.idproduct)
                .input('ventaTotal', sql.Float, newVenta.ventaTotal)
                .input('ventaTipoPago', sql.VarChar(45), newVenta.ventaTipoPago)

                .query('UPDATE ventas SET idusers = @idusers, idproduct = @idproduct, ventaTotal = @ventaTotal, ventaTipoPago = @ventaTipoPago WHERE idventa = @idventa');

            response.send('Venta updated successfully');
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Eliminar un producto
    app.delete('/ventas/:id', async (request, response) => {
        const id = request.params.id;

        try {
            const pool = await sql.connect('./data/config');

            const result = await pool
                .request()
                .input('id', sql.Int, id)
                .query('DELETE FROM ventas WHERE idventa = @id');

            response.send('Venta deleted');
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });
    //-----------------------------------------------------------------------------------------------------------------------/Ventas

}

//Exportar el router
module.exports = router;