var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


var clocksPath = path.join(__dirname, './../public/resources/clocks.json');
var timezonesPath = path.join(__dirname, './../public/resources/timezones.json');


router.get('/clocks', function (req, res, next) {
    if (!fs.existsSync(clocksPath)) {
        res.status(200).json({
            message: 'Empty object',
            obj: []
        });
    } else {
        var file = fs.readFileSync(clocksPath, 'utf8');
        var clocks = JSON.parse(file);

        res.status(200).json({
            message: 'Success',
            obj: clocks.clocks
        });
    }
});

router.get('/timezones', function (req, res, next) {
    if (!fs.existsSync(timezonesPath)) {
        res.status(404).json({
            title: 'File not found',
            error: {
                message: 'File timezone.json not found'
            }
        });
    } else {
        var file = fs.readFileSync(timezonesPath, 'utf8');
        var zones = JSON.parse(file);

        res.status(200).json({
            message: 'Success',
            obj: zones.zones
        });
    }
});

router.post('/clock', function (req, res, next) {

    const keys = Object.keys(req.body);
    // check if req body contains ONLY timezone and description keys
    if (keys.length > 2 || !keys.includes("timezone") || !keys.includes("description")) {
        return res.status(400).json({
            title: 'Bad request',
            error: {
                message: 'Request body must contain only timezone and description'
            }
        });
    }

    var clock = {};
    clock.timezone = req.body.timezone;
    clock.description = req.body.description;

    // find gmtOffset in timezones.json

    if (!fs.existsSync(timezonesPath)) {
        return res.status(404).json({
            title: 'File not found',
            error: {
                message: 'File timezone.json not found'
            }
        });
    } else {
        var file = fs.readFileSync(timezonesPath, 'utf8');
        var zones = JSON.parse(file);

        for (let i = 0; i < zones.zones.length; i++) {
            if (zones.zones[i].timezone === clock.timezone) {
                clock.gmtOffset = zones.zones[i].gmtOffset;
                break;
            }
        }

        if (clock.gmtOffset === undefined) {
            return res.status(500).json({
                title: 'Internal Server Error',
                error: {
                    message: 'Can not find gmtOffset for ' + clock.timezone
                }
            });
        }
    }

    if (!fs.existsSync(clocksPath)) {
        clock.id = 1;

        var clocks = {
            "clocks": []
        };
        clocks.clocks.push(clock);

        fs.writeFileSync(clocksPath, JSON.stringify(clocks), {encoding: 'utf8', flag: 'w'}, (err) => {
            return res.status(500).json({
                title: 'Internal Server Error',
                error: {
                    message: 'Can not write to file clocks.json'
                }
            });
        });
    } else {
        var file = fs.readFileSync(clocksPath, 'utf8');
        var clocks = JSON.parse(file);

        if (clocks.clocks.length == 0) {
            clock.id = 1;
        } else {
            clock.id = clocks.clocks[clocks.clocks.length - 1].id + 1;
        }

        clocks.clocks.push(clock);

        fs.writeFileSync(clocksPath, JSON.stringify(clocks), {encoding: 'utf8', flag: 'w'}, (err) => {
            return res.status(500).json({
                title: 'Internal Server Error',
                error: {
                    message: 'Can not write to file clocks.json'
                }
            });
        });
    }

    return res.status(200).json({
        message: 'Clock added',
        obj: clock
    });

});

router.delete('/clock/:id', function (req, res, next) {
    if (!fs.existsSync(clocksPath)) {
        return res.status(500).json({
            title: 'Internal Server Error',
            error: {
                message: 'There is no clocks.json file'
            }
        });
    } else {
        var file = fs.readFileSync(clocksPath, 'utf8');
        var clocks = JSON.parse(file);
        var idExists = false;
        var clock = {};

        // find clock to delete
        for (let i = 0; i < clocks.clocks.length; i++) {
            if (clocks.clocks[i].id == +req.params.id) {
                clock = clocks.clocks[i];
                clocks.clocks.splice(i, 1);
                idExists = true;
                break;
            }
        }

        if (!idExists) {
            // no clock with provided id
            return res.status(500).json({
                title: 'Internal Server Error',
                error: {
                    message: 'Can not find clock with id = ' + req.params.id
                }
            });
        } else {
            fs.writeFileSync(clocksPath, JSON.stringify(clocks), {encoding: 'utf8', flag: 'w'}, (err) => {
                return res.status(500).json({
                    title: 'Internal Server Error',
                    error: {
                        message: 'Can not write to file clocks.json'
                    }
                });
            });
        }

        return res.status(200).json({
            message: 'Clock deleted',
            obj: clock
        });
    }
});

router.put('/clock/:id', function (req, res, next) {
    if (!fs.existsSync(clocksPath)) {
        return res.status(500).json({
            title: 'Internal Server Error',
            error: {
                message: 'There is no clocks.json file'
            }
        });
    }

    var clockFile = fs.readFileSync(clocksPath, 'utf8');
    var clocks = JSON.parse(clockFile);

    // find clock with id = req.params.id
    var idExists = false;
    var oldClock = {};
    var newClock = {};

    newClock.id = +req.params.id;
    newClock.timezone = req.body.timezone;
    newClock.description = req.body.description;

    for (let i = 0; i < clocks.clocks.length; i++) {
        if (clocks.clocks[i].id == +req.params.id) {
            oldClock = clocks.clocks[i];
            idExists = true;
            break;
        }
    }

    if (!idExists) {
        return res.status(400).json({
            title: 'Bad Request',
            error: {
                message: 'Can not find clock with id = ' + req.params.id
            }
        });
    }

    // find gmtOffset for updated clock
    if (!fs.existsSync(timezonesPath)) {
        return res.status(500).json({
            title: 'Internal Server Error',
            error: {
                message: 'There is no timezones.json file'
            }
        });
    }

    var zonesFile = fs.readFileSync(timezonesPath, 'utf8');
    var zones = JSON.parse(zonesFile);

    for (let i = 0; i < zones.zones.length; i++) {
        if (zones.zones[i].timezone === newClock.timezone) {
            newClock.gmtOffset = zones.zones[i].gmtOffset;
            break;
        }
    }

    if (newClock.gmtOffset === undefined) {
        return res.status(500).json({
            title: 'Internal Server Error',
            error: {
                message: 'Can not find gmtOffset for ' + newClock.timezone
            }
        });
    }

    // ok, we have oldClock and newClock
    clocks.clocks[clocks.clocks.indexOf(oldClock)] = newClock;

    fs.writeFileSync(clocksPath, JSON.stringify(clocks), {encoding: 'utf8', flag: 'w'}, (err) => {
        return res.status(500).json({
            title: 'Internal Server Error',
            error: {
                message: 'Can not write to file clocks.json'
            }
        });
    });

    return res.status(200).json({
        message: 'Clock updated',
        obj: newClock
    });

});

module.exports = router;