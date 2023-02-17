const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');
const path = require('path');
const client = require('axios');
const { response } = require('express');
const https = require('https');
const hackAPI = 'http://10.5.42.23:3000';
const exchangeAPI = 'https://10.2.38.0';

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "views")));
app.use('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    req.currentUser = "dubeypiyush@microsoft.com";
    next()
})
app.set('views', __dirname + '/views');

const agent = new https.Agent({
    rejectUnauthorized: false
});


let config = {
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4NEQ1OTcyRTBCM0ZCMTdFRTdDRkI0MzUzQ0YyMkYzMjlDNjkyNEYiLCJ4NXQiOiJhRTFaY3VDei14ZnVmUHREVTg4aTh5bkdrazgiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJhcHBpZCI6Ijg2YjRiNGI0LWRiMTAtNDgxYy04NzZiLTA3NDQ3ZTdmMjA0ZiIsInNjcCI6Ikdyb3VwLlJlYWQuQWxsIEdyb3VwLlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZC5TaGFyZWQgR3JvdXAuUmVhZEJhc2ljLkFsbCBHcm91cC5SZWFkQmFzaWMuU2hhcmVkIEdyb3VwLlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZFdyaXRlLlNoYXJlZCBHcm91cC1JbnRlcm5hbC5SZWFkV3JpdGUuQWxsIEdyb3VwLUludGVybmFsLlJlYWRXcml0ZS5TaGFyZWQgTWFpbC5SZWFkV3JpdGUgTWFpbC5SZWFkV3JpdGUuQWxsIE1haWwuUmVhZFdyaXRlLlNoYXJlZCBNYWlsLldyaXRlIE1haWwuV3JpdGUuQWxsIE1haWwuV3JpdGUuU2hhcmVkIE1haWxib3hTZXR0aW5ncy5SZWFkV3JpdGUgTWFpbGJveFNldHRpbmdzLlJlYWRXcml0ZS5BbGwgTWFpbGJveFNldHRpbmdzLlJlYWRXcml0ZS5TaGFyZWQgRGlyZWN0b3J5LlJlYWQuR2xvYmFsIEdyb3VwLUludGVybmFsLldyaXRlLkdsb2JhbCBNZXNzYWdpbmdHcm91cC5SZWFkV3JpdGUuQWxsIiwib2lkIjoiMmEzZDJmNjAtMTI3YS00ZDM5LTkxMDktNDBjODU4ZjZiMjZkIiwidGlkIjoiZmM2ZDVjNDYtNjFlNS00ZjIzLThiNWQtMjc5ODBmM2Y2NzVkIiwic210cCI6InN1ZG9hZG1pbkBoYWNrLm9yZyIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sIm5iZiI6MTY3NjU0MjMwMCwiZXhwIjoxNjc2NjI4NzAwLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS10ZHMuY29tL2ZjNmQ1YzQ2LTYxZTUtNGYyMy04YjVkLTI3OTgwZjNmNjc1ZCIsImF1ZCI6Imh0dHBzOi8vZXhjaGFuZ2VsYWJzLmxpdmUtaW50LmNvbSJ9.SXApbbeDNseruLPqc7TxYbKuw104Dw7lkrRPqfRU3C-rYJdPGvR6Z_x3PWOmM4SEdKKWepbg1mfxm2IVOmceY5ONPVJXHUGhoeKVjP1sadbcEfrlTfr9iekak09nnScnO51ObrFDv4Y9MDmhu-i5WF2L0v-bVIxD872FZBfbO26Vrv9m3P9DiNcDgZko9KdLTGP_zoYJ6SHW9em_3qQRI7CRpqA0t3hNsM4neUEsYUgtgUNSHVzz3eIVJ25v4eAPasSxfe6mS4Uo28BE1C_rIkOUPGsyLxMFC-uujb_8YkrA0UIvqpVZdkZDdSyL9e_RRQLskfdpor8FNmzTJChRYQ',
        'Content-Type': 'application/json',
        'prefer': 'exchange.behavior="CreateGroup,UpdateGroup,GroupDetailsExtended,UpdateGroupV2,OpenComplexTypeExtensions,GroupMembers"',
    },
    httpsAgent: agent
}

app.get('/', (req, res) => {
    client.get(hackAPI + '/competitions')
        .then(apiResp => {
            if (apiResp === undefined) throw new Error("hackAPI not responding");
            console.log(apiResp.data)
            res.render('index', { active: "index", data: apiResp.data, currentUser: req.currentUser });
        })
        .catch(err => {
            console.log(err)
            res.render('error')
        })

});

app.get('/detail/:hackathonId', (req, res) => {
    let hackathonId = req.params.hackathonId;
    client.get(hackAPI + '/groupsbycid/' + hackathonId)
        .then(apiResp => {
            if (apiResp === undefined) throw new Error("hackAPI not responding");
            console.log(apiResp.data)
            res.render('index', { active: "detail", data: apiResp.data, currentUser: req.currentUser });
        })
        .catch(err => {
            console.log(err)
            res.render('error')
        })

})

app.get('/overview/:hackId', (req, res) => {
    client.get(hackAPI + '/groups/' + req.params.hackId)
        .then(apiResp => {
            if (apiResp === undefined) throw new Error("hackAPI not responding");
            console.log(apiResp.data)
            let getMembersApi = exchangeAPI + `/api/beta/groups('${apiResp.data.data.ugid}')/members`
            console.log("Calling: " + getMembersApi)
            client.get(getMembersApi, config)
                .then(exchResp => {
                    if (exchResp === undefined) throw new Error("exchangeAPI not responding");
                    console.log(exchResp.data)

                    let hackData = {
                        name: apiResp.data.data.name,
                        description: apiResp.data.data.description,
                        imageUrl: apiResp.data.data.imageUrl,
                        team: []
                    }
                    exchResp.data.value.forEach(member => {
                        hackData.team.push({
                            name: member.DisplayName,
                            email: member.EmailAddress,
                            type: member.MemberType
                        })
                    })
                    console.log(hackData)
                    res.render('index', { active: "hackdetails", data: hackData, currentUser: req.currentUser });
                }).catch(err => {
                    console.log(err)
                    res.render('error')
                })
        })
});

app.get('/index', (req, res) => {
    res.render('/', { active: "index" });
});

app.get('/registerHack', (req, res) => {
    res.render('index', { active: "registerHack", currentUser: req.currentUser });
});

app.post('/createGroup',(req, res) => {
    var formData = {
                DisplayName: req.body.name,
                Description: req.body.desc,
                Alias:req.body.alias,
                AccessType: "Private"
                
            };
    var ugData = {
        Group:formData
    }
    client.post(exchangeAPI+ '/api/beta/me/CreateGroup', ugData, config)
    .then(apiResp => {
        console.log(apiResp.data);
        formData.competition = "c1";
        formData.ugId = apiResp.data.Id;
        formData.email = apiResp.data.EmailAddress;
        client.post(hackAPI + '/groups', formData)
        .then(apiResp => {
              res.render('index', { active: "registerHack", currentUser: req.currentUser });
        })
    })
});

app.get('/createUG', (req, res) => {
    client.get('https://10.2.38.0/api/v2.0/groups/rbacorreamonday1008@hack.org', config)
        .then(apiResp => {
            console.log(apiResp.data)
            res.send(apiResp.data)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })

})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

