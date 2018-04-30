

const sql = require('mssql');
const os = require('os');

const connectionString = 'Server=localhost\\SQLEXPRESS03;Database=master;Trusted_Connection=True;'
var config = {
    server: 'localhost',
    user: 'sa',
    password: '150302',
    database: 'master'
}
var interfaces = os.networkInterfaces();


var db = {}
function getIp(){

    let addresses = [];
    
    for (var k in interfaces) {
        if( k === "Ethernet"){
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }
        
    }
    return addresses[0];    

}
db.localIp = getIp();
db.testeConnection = function(){
    const pool = new sql.ConnectionPool(config)
     
    pool.connect(err => {
        console.log(err);
    })
    pool.close();
}

sql.on('error', err => {
    console.log(err);
})
db.check = function (){
   return new Promise( (resolve, reject) => {

    var existeDB = false;
    var query = "select name , database_id FROM master.sys.databases";
    var executed = false;
    var error = false;
    config.server = db.localIp;
    const pool = new sql.ConnectionPool(config, err =>{
        console.log(err);
        
        var request = new sql.Request(pool);
        request.query(query, (err, record)=>{
            
            executed = true;
            if( !err === null ){
                error = true;
            } else {

                record.recordset.forEach( (value, index, array) =>{
                    if(value.name === "MiliumNFCe"){
                        resolve(true);
                        
                    }
                    console.log(value.name);
                })
            }
            resolve(false);                        
        })

    } )
   });
};

db.create = function() {
    criaDB();        
};

db.select =  function(query){

    var existeDB = false;

    const pool = new sql.ConnectionPool(config, err =>{

        var request = new sql.Request(pool);
        request.query(query, (err, recordset)=>{
            
            recordset.recordset.forEach( (value, index, array) =>{
                if(value.name === "MiliumNFCe"){
                    existeDB = true;
                }
                console.log(value.name);
            })
            
            if(!existeDB){
                console.log('Nao achou DB');
                criaDB(request);                
            }
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


function criaDB(){

    
    var commandDB = "USE master; CREATE DATABASE MiliumNFCe;"
    var commandTableUsuario = "USE MiliumNFCe;"
    commandTableUsuario = commandTableUsuario + "CREATE TABLE [dbo].[Users] ("+
       "[id] [int]  NOT NULL, "+ 
       "[UserName] [varchar](50) NOT NULL,"+
       "[Email] [varchar](250) NOT NULL,"+
       "[Password] [varchar](250) NOT NULL ) ";

    console.log('Criar commandos de criacao de DB');
    

    const pool = new sql.ConnectionPool(config, (err) =>{
        var request = new sql.Request(pool);   
        request.query(commandDB, (err, resultset)  =>{
        
            if(err === null){
                console.log("Criou o DB");
                console.log('Criar commandos de criacao de Tabela');
                request.query(commandTableUsuario, (err2, resultset2)  =>{
                    if(err2 === null){
                        console.log("Criou a tabela");
                    }else{
                        console.log(err2);
                    }        
                } )  
            }else{
                console.log(err);
            }
            
            
        } )          

    });
}

module.exports = db;



