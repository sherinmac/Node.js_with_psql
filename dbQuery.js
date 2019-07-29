const { Pool, Client } = require('pg')
const pool = new Pool();

//Function with promises
const executeSelect = (query) => {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, res) => {
            if (err) {
                reject(err);
            }
            //console.log(res.rows);
            pool.end();
            resolve(res.rows);
        });
    });
}

const executeInsert = (query) => {
    return new Promise((resolve, reject) => {
        // callback
        pool.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                //console.log(res.rows[0]);
                resolve(res.rows);
            }
        })
        // promise
        pool
            .query(query)
            .then(res => console.log(res.rows[0]))
            .catch(e => console.error(e.stack))
    });
}


//Function  with out  promises
// const executeSelect = (query) => {

//     return pool.query(query, (err, res) => {
//         if(err){
//             throw err;
//         }
//         console.log(res.rows);
//         pool.end()
//         return res.rows;

//     });
// }


module.exports = {
    executeSelect,
    executeInsert
}
