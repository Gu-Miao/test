let express = require('express');
let router = express.Router();

// 引入第三方库
let jsonParser = require('body-parser').json();
let app = express();
app.use(jsonParser);

// 引入数据库集合模型
let paperModel = require('../../model/papers');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('paperManagementLayer/new');
});

router.post('/', (req, res, next) => {
    let data = req.body;
    data.questions = JSON.parse(data.questions);
    console.log(data);
    paperModel.insertMany(data, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log(docs);
            res.json(docs);
        }

    });
});

module.exports = router;