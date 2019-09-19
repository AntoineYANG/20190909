const express = require('express');
const proxy = require('http-proxy-middleware');
const fs = require('fs');
const process = require('child_process');

const options = {
    target: "http://localhost:3000",
    changeOrigin: true,
}

const apiProxy = proxy(options);

const app = express();

app.use(express.static(__dirname));




var THREAD_RUNING = false;

app.get('/run/:year/:source/:topic_amount', (req, res) => {
    if (THREAD_RUNING) {
        console.warn('   >> Debouce principle rejected one request.');
        res.json({state: 'failed', reason: 'process is already running'});
        return;
    }
    console.log("\nNew GET request: ", { model: 'LDA', ...req.params });
    THREAD_RUNING = true;
    fs.readFile('../public/data/lda$' + req.params.topic_amount + '$' + req.params.year + '@' + req.params.source + '.json',
    {encoding: 'UTF-8'}, (err, data) => {
        if (err) {
            console.log('   >> Started running LDA model...');
            process.exec('python ../public/Python/Lda.py ' + req.params.year + ' ' + req.params.source + ' ' + req.params.topic_amount,
                (error, stdout, stderr) => {
                    if (error) {
                        console.warn(error);
                        THREAD_RUNING = false;
                    }
                    else {
                        fs.readFile('../public/data/lda$' + req.params.topic_amount + '$' + req.params.year
                        + '@' + req.params.source + '.json', {encoding: 'UTF-8'}, (err, data) => {
                            if (err) {
                                console.warn(err);
                            }
                            else {
                                console.log("   >> LDA model complished");
                                console.log(" >> Respond returned, total size = ", data.length);
                                res.json(data);
                            }
                        });
                        THREAD_RUNING = false;
                    }
                });
        }
        else {
            console.log(" >> Respond returned, total size = ", data.length);
            res.json(data);
            THREAD_RUNING = false;
        }
    });
});

app.get('/tsne/:year/:source/:topic_amount', (req, res) => {
    if (THREAD_RUNING) {
        console.warn('   >> Debouce principle rejected one request.');
        res.json({state: 'failed', reason: 'process is already running'});
        return;
    }
    console.log("\nNew GET request: ", { model: 't-sne', ...req.params });
    THREAD_RUNING = true;
    fs.readFile('../public/data/tsne$' + req.params.topic_amount + '$' + req.params.year + '@' + req.params.source + '.json',
    {encoding: 'UTF-8'}, (err, data) => {
        if (err) {
            console.log('   >> Started running t-sne model...');
            process.exec('python ../public/Python/tsne.py '
                + req.params.year + ' ' + req.params.source + ' ' + req.params.topic_amount,
                (error, stdout, stderr) => {
                    if (error) {
                        console.warn(error);
                        THREAD_RUNING = false;
                    }
                    else {
                        fs.readFile('../public/data/tsne$' + req.params.topic_amount + '$' + req.params.year
                        + '@' + req.params.source + '.json', {encoding: 'UTF-8'}, (err, data) => {
                            if (err) {
                                console.warn(err);
                            }
                            else {
                                console.log("   >> t-sne model complished");
                                console.log(" >> Respond returned, total size = ", data.length);
                                res.json(data);
                            }
                        });
                        THREAD_RUNING = false;
                    }
                });
        }
        else {
            console.log(" >> Respond returned, total size = ", data.length);
            res.json(data);
            THREAD_RUNING = false;
        }
    });
});

app.get('/nlp/:year/:source', (req, res) => {
    if (THREAD_RUNING) {
        console.warn('   >> Debouce principle rejected one request.');
        res.json({state: 'failed', reason: 'process is already running'});
        return;
    }
    console.log("\nNew GET request: ", { model: 'SnowNLP', ...req.params });
    THREAD_RUNING = true;
    fs.readFile('../public/data/snownlp$' + req.params.year + '@' + req.params.source + '.json',
    {encoding: 'UTF-8'}, (err, data) => {
        if (err) {
            console.log('   >> Started running SnowNLP model...');
            process.exec('python ../public/Python/nlp.py '
                + req.params.year + ' ' + req.params.source,
                (error, stdout, stderr) => {
                    if (error) {
                        console.warn(error);
                        THREAD_RUNING = false;
                    }
                    else {
                        fs.readFile('../public/data/snownlp$' + req.params.year
                        + '@' + req.params.source + '.json', {encoding: 'UTF-8'}, (err, data) => {
                            if (err) {
                                console.warn(err);
                            }
                            else {
                                console.log("   >> SnowNLP model complished");
                                console.log(" >> Respond returned, total size = ", data.length);
                                res.json(data);
                            }
                        });
                        THREAD_RUNING = false;
                    }
                });
        }
        else {
            console.log(" >> Respond returned, total size = ", data.length);
            res.json(data);
            THREAD_RUNING = false;
        }
    });
});

app.get('/all/:source/:topic_amount', (req, res) => {
    if (THREAD_RUNING) {
        console.warn('   >> Debouce principle rejected one request.');
        res.json({state: 'failed', reason: 'process is already running'});
        return;
    }
    console.log("\nNew GET request: ", { model: 'LDA(total)', ...req.params });
    THREAD_RUNING = true;
    fs.readFile('../public/data/all$' + req.params.topic_amount + '@' + req.params.source + '.json',
    {encoding: 'UTF-8'}, (err, data) => {
        if (err) {
            console.log('   >> Started running LDA model...');
            process.exec('python ../public/Python/LdaAll.py ' + req.params.source + ' ' + req.params.topic_amount,
                (error, stdout, stderr) => {
                    if (error) {
                        console.warn(error);
                        THREAD_RUNING = false;
                    }
                    else {
                        fs.readFile('../public/data/all$' + req.params.topic_amount
                                + '@' + req.params.source + '.json', {encoding: 'UTF-8'}, (err, data) => {
                            if (err) {
                                console.warn(err);
                            }
                            else {
                                console.log("   >> LDA model complished");
                                console.log(" >> Respond returned, total size = ", data.length);
                                res.json(data);
                            }
                        });
                        THREAD_RUNING = false;
                    }
                });
        }
        else {
            console.log(" >> Respond returned, total size = ", data.length);
            res.json(data);
            THREAD_RUNING = false;
        }
    });
});

app.get('/clear', (req, res) => {
    if (THREAD_RUNING) {
        res.json({state: 'failed', reason: 'process is already running'});
        return;
    }
    THREAD_RUNING = true;
    console.log('\nStarted clearing extra files...');
    let files = fs.readdirSync('../public/data/');
    let count = 0;
    for (let i = 0; i < files.length; i++) {
        if (files[i].toString().startsWith('origin')) {
            continue;
        }
        fs.unlink('../public/data/' + files[i], err => {
            if (err) {
                console.err(err);
            }
        });
        count++;
        console.log('   >> Remove ' + files[i].toString());
    }
    console.log(' >> Clearing successed');
    THREAD_RUNING = false;
    res.json({state: 'successed', file_deleted: count});
});


app.listen(3080, () => {
    console.info("\nBackend server started at PORT 3080.");
});
