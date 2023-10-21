//const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const ping = require('ping');

// let dbConfig = config.get('db');
//var connection = mysql.createConnection(dbConfig);
let dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "presenze",
    password: process.env.DB_PASSWORD || "SalveMondo",
    database: process.env.DB_DATABASE || "presenze",
}
let connection = mysql.createPool(dbConfig);
let data = [];
let i = 0;

async function CheckVivo(IP)
{
    var cfg = {
        timeout: 1,
        min_reply: 1
    };
    var RetValue = false;

    await ping.sys.probe(IP,function (IsAlive) {
        if (debug) {
            var msg = IsAlive ? 'host ' + IP + ' is alive' : 'host ' + IP + ' is dead';
            console.log(msg);
        }
        RetValue = IsAlive;
    },cfg);
    return RetValue;

}

exports.readAllRasp = (req, res)=> {

    connection.query("SELECT * FROM `Aule` ", queryCB);
    async function queryCB(error, results) {
        if (error) throw error;
        numElem = results.length;
        for (i=0;i<numElem;i++) {
            objRasp = {};
            objRasp.ID_Edificio     = results[i].ID_Edificio;
            objRasp.ID_Aula         = results[i].ID_Aula;
            objRasp.Descrizione     = results[i].Descrizione;
            PingAddress             = results[i].IP;
            objRasp.IP              = PingAddress;
            objRasp.isAlive         = await CheckVivo(PingAddress);
            data[i]                 = objRasp;
        }
        res.json(data);
        if(debug) {
            console.log(data)
        }
    }
};

exports.readRasp = (req,res) => {

    let IdEdificio  = req.params.IdEdificio;
    let IdAula      = req.params.IdAula;
    if(debug) {
        console.log(IdEdificio);
        console.log(IdAula);
    }
    connection.query('SELECT * FROM `Aule` WHERE ID_Edificio = ? AND ID_Aula = ?',[IdEdificio,IdAula],queryCB);
        async function queryCB (error, results, fields) {
        if (error) throw error;
        if (results.length !== 1) {
            if (debug) {
                console.log("No rows")
            }
            res.status(204).send();
        } else {
            let IP = results[0].IP;
            if (debug) {
                console.log(IP)
            }
            let Vivo = await CheckVivo(IP);
            objRasp = {};
            objRasp.ID_Edificio     = IdEdificio;
            objRasp.ID_Aula         = IdAula;
            objRasp.Descrizione     = results[0].Descrizione;
            objRasp.IP              = IP;
            objRasp.isAlive         = Vivo;
            if (debug) {
                if (Vivo) {
                    console.log('VIVO');
                } else {
                    console.log('MORTO')
                }
            }
            res.status(200).json(objRasp);
        }
    }
}

exports.riceviDati = (req,res) => {

/* Queste sitruzioni prendon o lìIP da cui è arrivat ala richiesta. Potrebbe essere meglio?
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split(':').pop();
    console.log(ip);
    */

    ip = req.body.ip;
    if (debug) {
        console.log(ip);
        console.log(req.body);
    }
    connection.query('SELECT * FROM `Aule` WHERE IP = ? ',ip, function (error, results, fields) {
        if (error) throw error;
        if (results.length !== 1) {
            if (debug) {
                console.log("No rows")
            }
            res.status(204).send();
        } else {
            let dataRilevazione     = req.body.data;
            let presenze            = req.body.presenze;
            let ID_Edificio         = results[0].ID_Edificio;
            let ID_Aula             = results[0].ID_Aula
            if (debug) {
                console.log(ip)
                console.log(results);
                console.log(req.body);
                console.log(dataRilevazione);
                console.log(presenze);
                console.log(ID_Edificio);
                console.log(ID_Aula);
            }
            let v = [ID_Edificio,ID_Aula,dataRilevazione,presenze];
            connection.query("INSERT INTO Presenze VALUES (?,?,?,?)",v,function (error, results, fields) {
                if (error) throw error; //FAre il catch di chiave duplicata
                if(debug) {
                    console.log(results.insertId);
                }
            })
            res.status(201).send();
        }
    });
}

exports.updateAllData = (req,res) => {

    connection.query('SELECT * FROM `Aule` ', queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        results.forEach(Aula => {
            let IP = Aula.IP;
            if (debug) {
                console.log(Aula);
                console.log(IP)
            }
            let URL = "http://" + IP +":3000/sendData"
            if (debug){
                console.log(URL);
            }
            axios.get(URL)
                .then(resAxios => {
                    const headerDate = resAxios.headers && resAxios.headers.date ? resAxios.headers.date : 'no response date';
                    console.log('Status Code:', resAxios.status);
                    console.log('Date in Response header:', headerDate);
                })
                .catch(err => {
                    console.log('Error: ', err.message);
                });
        });
    }
}
exports.updateOneData = (req,res) => {

    let IdEdificio = req.params.IdEdificio;
    let IdAula = req.params.IdAula;
    if (debug) {
        console.log(IdEdificio);
        console.log(IdAula);
    };
    connection.query('SELECT * FROM `Aule` WHERE ID_Edificio = ? AND ID_Aula = ?', [IdEdificio, IdAula], queryCB);

    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length !== 1) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
            return;
        } else {
            let IP = results[0].IP;
            if (debug) {
                console.log(IP)
            }
            let URL = "http://" + IP +":3000/sendData"
            if (debug){
                console.log(URL);
            }
            axios.get(URL)
                .then(resAxios => {
                    const headerDate = resAxios.headers && resAxios.headers.date ? resAxios.headers.date : 'no response date';
                    console.log('Status Code:', resAxios.status);
                    console.log('Date in Response header:', headerDate);

                })
                .catch(err => {
                    console.log('Error: ', err.message);
                });
        }
    }
    res.sendStatus(200);
}

exports.updateOneTimeout = (req,res) => {
    const IdEdificio = req.params.IdEdificio;
    const IdAula = req.params.IdAula;
    const minuti = req.params.minuti;

    if (debug) {
        console.log(IdEdificio);
        console.log(IdAula);
        console.log(minuti);
    };
    connection.query('SELECT * FROM `Aule` WHERE ID_Edificio = ? AND ID_Aula = ?', [IdEdificio, IdAula], queryCB);

    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length !== 1) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
            return;
        } else {
            let IP = results[0].IP;
            if (debug) {
                console.log(IP)
            }
            let URL = "http://" + IP +":3000/setTimeout/" + minuti;
            if (debug){
                console.log(URL);
            }
            axios.get(URL)
                .then(resAxios => {
                    const headerDate = resAxios.headers && resAxios.headers.date ? resAxios.headers.date : 'no response date';
                    console.log('Status Code:', resAxios.status);
                    console.log('Date in Response header:', headerDate);
                })
                .catch(err => {
                    console.log('Error: ', err.message);
                });
        }
    }
}

exports.GetLastValue  = (req,res) => {
    const IdEdificio = req.params.IdEdificio;
    const IdAula = req.params.IdAula;
    var Presenze = 0;

    if (debug) {
        console.log(IdEdificio);
        console.log(IdAula);
    }
    ;
    connection.query('SELECT Data, Presenze FROM ' +
        '(SELECT ID_Edificio, ID_Aula, MAX(DATA) as Max_Data FROM Presenze ' +
        'WHERE ID_Edificio = ? AND ID_AULA = ?) max_data ' +
        'INNER JOIN Presenze ON ' +
        'Presenze.data = max_data.Max_data AND ' +
        'max_data.ID_EDificio = Presenze.ID_edificio AND ' +
        'max_data.ID_Aula = Presenze.ID_Aula', [IdEdificio, IdAula], queryCB);

    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length !== 1) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
            return;
        } else {
            let Presenze = results[0].Presenze;
            let Data = results[0].Data;
            let Result = {};
            Result.Data = Data;
            Result.Presenze = Presenze;
            res.json(Result);
        }
    }
}

exports.GetHistory = (req,res) => {
    const IdEdificio = req.params.IdEdificio;
    const IdAula = req.params.IdAula;
    const DateFrom = req.params.DateFrom ? req.params.DateFrom : new Date(0);
    const DateTo = req.params.DateTo ? req.params.DateTo : new Date();

    if (debug) {
        console.log(IdEdificio);
        console.log(IdAula);
        console.log(DateFrom);
        console.log(DateTo);
    };
    connection.query('SELECT Data, Presenze FROM Presenze WHERE ID_Edificio = ? AND ID_Aula = ? AND Data BETWEEN ? AND ?' ,
            [IdEdificio, IdAula,DateFrom,DateTo], queryCB);

    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
            return;
        } else {
            data = [];
            let count = 0;
            results.forEach(Aula => {
                data[count] = {};
                data[count].data = Aula.Data;
                data[count].presenze = Aula.Presenze;
                count++;
            })
            res.status(200).json(data);
        }
    }
}

exports.GetAllEdifici = (req,res) => {

    connection.query('SELECT * FROM Edifici' , queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
            return;
        } else {
            i = 0;
            data = [];
            results.forEach(Edificio =>{
                data[i]={};
                data[i].Id_Edificio = Edificio.ID_Edificio;
                data[i].Descrizione = Edificio.Descrizione;
                i++;
            })
            res.status(200).json(data);
        }
    }
}
exports.GetOneEdificio = (req,res) => {
    const IdEdificio = req.params.IdEdificio;

    connection.query('SELECT * FROM Edifici WHERE ID_Edificio = ?', IdEdificio, queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
            return;
        } else {
            let ResObj = {};
            ResObj.ID_Edificio = results[0].ID_Edificio;
            ResObj.Descrizione = results[0].Descrizione;
            if (debug) {
                console.log(ResObj)
            }
            res.status(200).json(ResObj);
        }
    }
}
exports.inserisciEdificio = (req,res) => {
    var ID_Edificio;
    var Descrizione;

    if (debug) {
        console.log(req.body);
    }
    connection.query('SELECT MAX(ID_Edificio) as MaxID FROM Edifici', queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
            return;
        } else {
            ID_Edificio = results[0].MaxID + 1;
            Descrizione = req.body.Descrizione;
            InsValue =[ID_Edificio,Descrizione];
            connection.query("INSERT INTO Edifici VALUES (?,?)",InsValue,function (error, results, fields) {
                if (error) throw error; //FAre il catch di chiave duplicata
                if(debug) {
                    console.log(results.insertId);
                }
            })
            res.status(201).json(InsValue);
        }
    }
}

exports.modificaEdificio = (req,res) => {
    const ID_Edificio = req.params.IdEdificio;

    if (debug) {
        console.log(ID_Edificio);
        console.log(req.body);
    }
    Descrizione = req.body.Descrizione;
    InsValue =[Descrizione,ID_Edificio];
    connection.query("UPDATE Edifici SET Descrizione = ? WHERE ID_Edificio = ?",InsValue,function (error, results, fields) {
        if (error) throw error; //FAre il catch di chiave duplicata
        if(debug) {
            console.log(results.insertId);
        }
    })
    res.sendStatus(201);
}
exports.cancellaEdificio = (req,res) => {
    const Id_Edificio = req.params.IdEdificio;

    connection.query('DELETE FROM Edifici WHERE ID_Edificio = ?', Id_Edificio, function (error, results, fields) {
        if (error) throw error;
        if(debug) {
            console.log(results.affectedRows);
        }
        res.sendStatus(201);
    })
}

exports.GetAllAule = (req,res) => {
    const ID_Edificio = req.params.ID_Edificio;

    connection.query('SELECT * FROM Aule WHERE ID_Edificio = ? ORDER BY Descrizione', ID_Edificio, queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
        } else {
            i = 0;
            data = [];
            results.forEach(Aula =>{
                data[i]={};
                data[i].ID_Edificio = Aula.ID_Edificio;
                data[i].ID_Aula = Aula.ID_Aula;
                data[i].Descrizione = Aula.Descrizione;
                data[i].IP = Aula.IP;
                data[i].Num_Cam = Aula.Num_Cam;
                i++;
            })
            res.status(200).json(data);
        }
    }
}
exports.GetOneAula = (req,res) => {
    const ID_Edificio  = req.params.ID_Edificio;
    const ID_Aula  = req.params.ID_Aula;

    connection.query('SELECT * FROM Aule WHERE ID_Edificio = ? AND  ID_Aula = ?', [ID_Edificio,ID_Aula], queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
        } else {
            let ResObj = {};
            ResObj.Id_Edificio = results[0].ID_Edificio;
            ResObj.Id_Aula = results[0].ID_Aula;
            ResObj.Descrizione = results[0].Descrizione;
            ResObj.IP = results[0].IP;
            ResObj.Num_Cam = results[0].Num_Cam;
            if (debug) {
                console.log(ResObj)
            }
            res.status(200).json(ResObj);
        }
    }
}
exports.inserisciAula = (req,res) => {
    const ID_Edificio  = req.params.ID_Edificio;
    var ID_Aula = 0;
    var IP = "";
    var Num_Cam = 0;
    var Descrizione = "";

    if (debug) {
        console.log(req.body);
    }
    connection.query('SELECT MAX(ID_Aula) as MaxID FROM Aule WHERE ID_Edificio = ?', ID_Edificio, queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
        } else {
            ID_Aula = results[0].MaxID + 1;
            Descrizione = req.body.Descrizione;
            IP = req.body.IP;
            Num_Cam = req.body.Num_Cam;
            InsValue =[ID_Edificio,ID_Aula,Descrizione,IP,Num_Cam];
            connection.query("INSERT INTO Aule VALUES (?,?,?,?,?)",InsValue,function (error, results, fields) {
                if (error) throw error; //FAre il catch di chiave duplicata
                if(debug) {
                    console.log(results.insertId);
                }
            })
            res.sendStatus(201);
        }
    }
}
exports.modificaAula = (req,res) => {
    const ID_Edificio  = req.params.ID_Edificio;
    const ID_Aula = req.params.ID_Aula;
    var IP = "";
    var Num_Cam = 0;
    var Descrizione = "";

    if (debug) {
        console.log(ID_Edificio);
        console.log(ID_Aula);
        console.log(req.body);
    }
    Descrizione = req.body.Descrizione;
    IP = req.body.IP;
    Num_Cam = req.body.Num_Cam;
    InsValue =[Descrizione,IP,Num_Cam,ID_Edificio,ID_Aula];
    connection.query("UPDATE Aule SET Descrizione = ?, IP = ?, Num_Cam = ? WHERE ID_Edificio = ? AND ID_Aula = ?",
        InsValue,function (error, results, fields) {
        if (error) throw error; //FAre il catch di chiave duplicata
        if(debug) {
            console.log(results.insertId);
        }
    })
    res.sendStatus(201);

}
exports.cancellaAula = (req,res) => {
    const Id_Edificio = req.params.IdEdificio;
    const ID_Aula = req.params.ID_Aula;

    connection.query('DELETE FROM Aule WHERE ID_Edificio = ? AND  ID_Aula = ?', [Id_Edificio,ID_Aula],
        function (error, results, fields) {
        if (error) throw error;
        if(debug) {
            console.log(results.affectedRows);
        }
        res.sendStatus(201);
    })
}

exports.GetAllUsers = (req,res) => {

    connection.query('SELECT * FROM Utenti' , queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
            return;
        } else {
            data = [];
            results.forEach(Utente =>{
                data.push({
                    ID_Utente : Utente.ID_Utente,
                    Username : Utente.Username,
                    Password : Utente.Password,
                    Descrizione: Utente.Descrizione,
                    Tipo: Utente.Tipo
                })
            })
            res.status(200).json(data);
        }
    }
}
exports.GetOneUser = (req,res) => {
    const ID_Utente = req.params.ID_Utente;

    connection.query('SELECT * FROM Utenti WHERE ID_Utente = ?', ID_Utente, queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.status(204).send();
        } else {
            let ResObj = {
                ID_Utente: results[0].ID_Utente,
                Username: results[0].Username,
                Password: results[0].Password,
                Descrizione: results[0].Descrizione,
                Tipo: results[0].Tipo
            };
            if (debug) {
                console.log(ResObj)
            }
            res.status(200).json(ResObj);
        }
    }
}

exports.NewUser = (req,res) => {

    if (debug) {
        console.log(req.body);
    }
    // Controllare se username esiste già!!!
    connection.query('SELECT MAX(ID_Utente) as MaxID FROM Utenti', queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
        } else {
            ID_Utente = results[0].MaxID + 1;
            Username = req.body.Username;
            Password = req.body.Password;
            Descrizione = req.body.Descrizione;
            Tipo = req.body.Tipo;
            InsValue =[ID_Utente,Username,Password,Descrizione,Tipo];
            connection.query("INSERT INTO Utenti VALUES (?,?,?,?,?)",InsValue,function (error, results, fields) {
                if (error) throw error; //FAre il catch di chiave duplicata
                if(debug) {
                    console.log(results.insertId);
                }
            })
            res.status(201).json(InsValue);
        }
    }

}
exports.ModifyUser = (req,res) => {
    const ID_Utente  = req.params.ID_Utente;
    const Username = req.body.Username;
    const Password = req.body.Password;
    const Descrizione = req.body.Descrizione;
    const Tipo = req.body.Tipo;

    if (debug) {
        console.log(ID_Utente);
        console.log(req.body);
    }
    let InsValue = [Username,Password,Descrizione,Tipo,ID_Utente];
    connection.query("UPDATE Utenti SET Username = ?, Password = ?, Descrizione = ?, Tipo = ? WHERE ID_Utente = ?",
        InsValue,function (error, results, fields) {
            if (error) throw error; //FAre il catch di chiave duplicata
            if(debug) {
                console.log(results.insertId);
            }
        })
    res.status(201).json(InsValue);


}
exports.DeleteUser = (req,res) => {
    const ID_Utente = req.params.ID_Utente;

    connection.query("DELETE FROM Utenti WHERE ID_Utente = ?", [ID_Utente],
        function (error, results, fields) {
            if (error) throw error;
            if(debug) {
                console.log(results.affectedRows);
            }
            res.sendStatus(201);
        })

}

exports.CheckUsername = (req,res) => {
    const Username = req.params.Username;

    if (debug) {
        console.log(Username);
    }
    connection.query('SELECT * FROM Utenti WHERE Username = ?', Username, queryCB);
    async function queryCB(error, results, fields) {
        if (error) throw error;
        if (results.length === 0) {
            if (debug) {
                console.log("No rows")
            }
            res.sendStatus(204);
        } else {
            let ResObj = {
                ID_Utente: results[0].ID_Utente,
                Username: results[0].Username,
                Password: results[0].Password,
                Descrizione: results[0].Descrizione,
                Tipo: results[0].Tipo
            };
            if (debug) {
                console.log(ResObj)
            }
            res.status(201).json(ResObj);
        }
    }
}
