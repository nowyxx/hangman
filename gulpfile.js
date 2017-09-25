var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    autoprefixer = require("gulp-autoprefixer"),
    plumber = require("gulp-plumber"),
    babel = require('gulp-babel');


/*####################################
            SASS TO CSS COMPILE
1. Download pluginn gulp-sass
npm install gulp-sass --save-dev
PLUMBER allows to use error support in gulp.js file. In case of error  he is not  closing a process in file but freeze it to  repair those errors.
/*#####################################
AUTOPREFIXER
gulp-autoprefixer
npm install -save-dev gulp-autoprefixer


SASS -> CSS + AUTOPREFIX 
************************/
gulp.task("css", function() {

    gulp.src("src/sass/*.scss")
        .pipe(plumber())
        .pipe(sass.sync()) // plumber synchronize
        .pipe(autoprefixer({
            browsers: ["last 2 version", "IE 9"]
        }))
        .pipe(gulp.dest("src/dist/css/"))
        .pipe(browserSync.stream()); //Reload
});

/*####################################
            Browser SYNC
npm install browser-sync --save-dev
**************************************/

gulp.task("server", function() {
    browserSync.init({
        server: "src/"
    });
});

/*####################################
                BABEL  
            ES6 -> ES5
npm install --save-dev gulp-babel babel-preset-env
*/
gulp.task('babel', function() {
    gulp.src('src/js/script.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('src/dist/js'))
});

/*#####################################
            AUTOPREFIX ONLY
gulp-autoprefixer
npm install -save-dev gulp-autoprefixer
**************************************/
gulp.task("autopref", function() {
    gulp.src("src/css/style.css")
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ["last 2 versions", "IE 9"]
        }))
        .pipe(gulp.dest("src/dist"));
});

/*###################CHANGES WATCHING######################*/
gulp.task("watch", function() {
    //gulp.watch(["src/*.html","src/**/*.js","src/css/*.css"], browserSync.reload); CSS ONLY 
    gulp.watch("src/sass/**/*.scss", ["css"]); // SASS
    gulp.watch(["src/*.html", "src/**/*.js"], browserSync.reload);

});


gulp.task("default", ["babel", "css", "server", "watch"]);