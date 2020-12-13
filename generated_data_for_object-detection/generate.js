const fs = require('fs');
const path = require('path');
const os = require('os');

const async = require('async');
const _ = require('lodash');

const { createCanvas, loadImage, CanvasRenderingContext2D } = require('canvas');
const floodfill = require('@roboflow/floodfill')(CanvasRenderingContext2D);

var Handlebars = require('handlebars');
var vocTemplate = Handlebars.compile(fs.readFileSync(__dirname + "/voc.tmpl", "utf-8"));

const IMAGES_TO_GENERATE = 5000;
const CONCURRENCY = Math.max(1, os.cpus().length - 1);

const CANVAS_WIDTH = 416;
const CANVAS_HEIGHT = 550;

const MAX_OBJECTS = 10;

const OUTPUT_DIR = path.join(__dirname, "output");

const OPEN_IMAGES = path.join(os.homedir(), "syntetic-data\\validation\\validation");
const BACKGROUNDS = fs.readFileSync(__dirname + "/OpenImages.filtered.txt", "utf-8").split("\n");

const FRUITS = path.join(os.homedir(), "syntetic-data\\fruits-360\\Training");
const folders = _.filter(fs.readdirSync(FRUITS), function(filename) {
    return filename.indexOf('.') != 0;
});
var classes = _.map(folders, function(folder) {
    return folder.split(" ")[0];
});

const OBJECTS = {};
_.each(folders, function(folder, i) {
    var cls = classes[i]; // get the class name

    var objs = [];
    objs = _.filter(fs.readdirSync(path.join(FRUITS, folder)), function(filename) {
        return filename.match(/\.jpe?g/);
    });

    objs = _.map(objs, function(image) {
        return path.join(folder, image);
    });

    if(!OBJECTS[cls]) {
        OBJECTS[cls] = objs;
    } else {
        _.each(objs, function(obj) {
            OBJECTS[cls].push(obj);
        });
    }
});
classes = _.uniq(classes);

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

_.defer(function() {
    var num_completed = 0;
    const progress_threshold = Math.max(1, Math.round( Math.min(100, IMAGES_TO_GENERATE/1000) ) );
    async.timesLimit(IMAGES_TO_GENERATE, CONCURRENCY, function(i, cb) {
        createImage(i, function() {
            // record progress to console
            num_completed++;
            if(num_completed%progress_threshold === 0) {
                console.log((num_completed/IMAGES_TO_GENERATE*100).toFixed(1)+'% finished.');
            }
            cb(null);
        });
    }, function() {
        // completely done generating!
        console.log("Done");
        process.exit(0);
    });
});

const createImage = function(filename, cb) {
    const BG = _.sample(BACKGROUNDS);
    loadImage(path.join(OPEN_IMAGES, BG)).then(function(img) {
        var canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        var context = canvas.getContext('2d');

        var scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        var x = (canvas.width / 2) - (img.width / 2) * scale;
        var y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);

        var objects = 1+Math.floor(Math.random()*Math.random()*(MAX_OBJECTS-1));

        var boxes = [];
        async.timesSeries(objects, function(i, cb) {
            // for each object, add it to the image and then record its bounding box
            addRandomObject(canvas, context, function(box) {
                boxes.push(box);
                cb(null);
            });
        }, function() {
            // write our files to disk
            async.parallel([
                function(cb) {
                    // write the JPG file
                    const out = fs.createWriteStream(path.join(__dirname, "output", filename+".jpg"));
                    const stream = canvas.createJPEGStream();
                    stream.pipe(out);
                    out.on('finish', function() {
                        cb(null);
                    });
                },
                function(cb) {
                    // write the bounding boxes to the XML annotation file
                    fs.writeFileSync(
                        path.join(__dirname, "output", filename+".xml"),
                        vocTemplate({
                            filename: filename + ".jpg",
                            width: CANVAS_WIDTH,
                            height: CANVAS_HEIGHT,
                            boxes: boxes
                        })
                    );

                    cb(null);
                }
            ], function() {
                // we're done generating this image
                cb(null);
            });
        });
    });
};


const addRandomObject = function(canvas, context, cb) {
    const cls = _.sample(classes);
    const object = _.sample(OBJECTS[cls]);

    loadImage(path.join(FRUITS, object)).then(function(img) {
        // erase white edges
        var objectCanvas = createCanvas(img.width, img.height);
        var objectContext = objectCanvas.getContext('2d');

        objectContext.drawImage(img, 0, 0, img.width, img.height);

        // flood fill starting at all the corners
        const tolerance = 32;
        objectContext.fillStyle = "rgba(0,255,0,0)";
        objectContext.fillFlood(3, 0, tolerance);
        objectContext.fillFlood(img.width-1, 0, tolerance);
        objectContext.fillFlood(img.width-1, img.height-1, tolerance);
        objectContext.fillFlood(0, img.height-1, tolerance);

        // cleanup edges
        objectContext.blurEdges(1);
        objectContext.blurEdges(0.5);


        objectContext.randomHSL(0.05, 0.4, 0.4);

        var scaleAmount = 0.5;
        const scale = 1 + Math.random()*scaleAmount*2-scaleAmount;

        var w = img.width * scale;
        var h = img.height * scale;

        const max_width = canvas.width - w;
        const max_height = canvas.height - h;

        var x = Math.floor(Math.random()*max_width);
        var y = Math.floor(Math.random()*max_height);

        context.save();

        const radians = Math.random()*Math.PI*2;
        context.translate(x+w/2, y+h/2);
        context.rotate(radians);
        context.drawImage(objectCanvas, -w/2, -h/2, w, h);
        context.restore();

        cb({
            cls: cls,
            xmin: Math.floor(x)+1,
            xmax: Math.ceil(x + w)+1,
            ymin: Math.floor(y)+1,
            ymax: Math.ceil(y + h)+1
        });
    });
};