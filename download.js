var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom')
var URL = require('url');

var start_no = 1;
var end_no = Number.MAX_VALUE;
var local_dir = process.env.USERPROFILE;

function get_url(url, dir, no, recursive) {
    if (no > end_no) {
        process.exit(0);
    }
    wurl = url + '_' + no + 　'.html';
    jsdom.env({
        url: wurl,
        resourceLoader: function(resource, callback) {
            var pathname = resource.url.pathname;
            if (/\.asp$/.test(pathname)) {
                resource.defaultFetch(function(err, body) {
                    if (err) return callback(err);
                    var audio_url = [];
                    urlreg = /^[m]*url[A-Za-z0-9]*[ ]*=.+/
                    postreg = /^mp3:.+(\+.+){1,}\'/
                    lines = body.split('\n');
                    for (var i = 0; i < lines.length; ++i) {
                        var line = lines[i].trim();
                        if (urlreg.test(line)) {
                            audio_url.push(line);
                        } else if (postreg.test(line)) {
                            line = line.replace('mp3:', 'mp3=');
                            audio_url.push(line);
                        }
                    }
                    eval(audio_url.join('\n'));
                    console.log(mp3);
                    lpath  = path.join(dir, path.dirname(URL.parse(mp3).pathname).split('/').slice(-1)[0]);
		    console.log(lpath);
                    fs.appendFileSync(lpath, mp3 + '\n');
                    callback(null, '"use strict";\n' + body);
                });
            } else {
                resource.defaultFetch(callback);
            };
        },
        features: {
            FetchExternalResources: ["iframe"],
            ProcessExternalResources: ["iframe"],
            SkipExternalResources: false
        },
        done: function(errors, window) {
            if (errors) {
                process.exit(0);
            }
            if (recursive) {
                get_url(url, dir, no + 1, recursive);
            }
        }
    });
}

if (process.argv.length >= 3) {
    if(typeof(process.argv[3]) != 'undefined'){
	 local_dir = process.argv[3];
    }
    if(typeof(process.argv[4]) != 'undefined'){
	 start_no = parseInt(process.argv[4]);
    }
    if(typeof(process.argv[5]) != 'undefined'){
	 end_no = parseInt(process.argv[5]);
    }

    get_url(process.argv[2], local_dir, start_no, start_no == end_no ? false : true);
}



//connect('http://www.5tps.com/play/15637_49_1_1.html');
