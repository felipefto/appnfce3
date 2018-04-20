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

function criaDB(request){

    var commandDB = "USE master; CREATE DATABASE MiliumNFCe;"
    var commandTableUsuario = "USE MiliumNFCe;"
    commandTableUsuario = commandTableUsuario + "CREATE TABLE [dbo].[Users] ("+
       "[id] [int]  NOT NULL, "+ 
       "[UserName] [varchar](50) NOT NULL,"+
       "[Email] [varchar](250) NOT NULL,"+
       "[Password] [varchar](250) NOT NULL ) ";

    console.log('Criar commandos de criacao de DB');
    
    request.query(commandDB, (err, resultset)  =>{
        
        if(err === null){
            console.log("Criou o DB");
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


   
    console.log('Criar commandos de criacao de Tabela');
                  
    
   

}

module.exports = db;



