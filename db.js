const sql = require('mssql');

const connectionString = 'Server=localhost\\SQLEXPRESS03;Database=master;Trusted_Connection=True;'
const config = {
    server: 'localhost',
    user: 'sa',
    password: '150302',
    database: 'master'
}

var db = {}
db.testeConnection = function(){

    const pool = new sql.ConnectionPool(config)
     
    pool.connect(err => {
        console.log(err);
    })
    pool.close();
}
db.select =  function(query){

    const pool = new sql.ConnectionPool(config, err =>{

        var request = new sql.Request(pool);
        request.query(query, (err, recordset)=>{
            console.log(err);
            recordset.recordset.forEach( (value, index, array) =>{
                console.log(value.name);
            })
        })

    } )
    console.log('Cria conexão');
    /*pool.connect(err => {
        console.log('conectou');
        let request = pool.request();
        console.log('query...');
        let result1 = request.query(query, (err, result) => {
            console.log(result);
        });       
        console.log(result1);

    })*/

}

module.exports = db;



