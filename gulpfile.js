var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    sass        = require('gulp-sass'),
    plumber     = require("gulp-plumber"),
    autoprefixer = require("gulp-autoprefixer");


/*####################################
KOMPILACJA SASS DO CSS
1. Pobierz pluginn gulp-sass
npm install gulp-sass --save-dev
PLUMBER umożliwia obsługę błędu tzn. w razie np braku poprawności pliku nie zakańcza działania procesu co umożliwia poprawienie pliku i prawidłowe wykonanie się procesu


/*#####################################
AUTOPREFIXER
gulp-autoprefixer
npm install -save-dev gulp-autoprefixer

 
 Czysta kompilacja sass do css + autoprefixy poniżej

gulp.task("css",function(){
    gulp.src("sciezka do pliku sass")
    .pipe(plumber())
    .pipe(sass.sync())// trzeba dodać sync by działało z plumberem
    .pipe(autoprefixer({
    browsers:["last 5 version","IE 9"]
    }));
    .pipe(gulp.dest("sciezkazapisudo kat"))
    .pipe(browserSync.stream());//przeladowanie styli po zapisaniu
});
*/
/*####################################
Browser SYNC
npm install browser-sync --save-dev
**************************************/


gulp.task("server", function() {
    browserSync.init({
        server: "www/"
    });
});
   
/*#####################################
AUTOPREFIXER
gulp-autoprefixer
npm install -save-dev gulp-autoprefixer
*/
gulp.task("autopref",function(){
    gulp.src("www/css/style.css")
    .pipe(plumber())
    .pipe(autoprefixer({
        browsers:["last 2 versions","IE 9"]
    }))
    .pipe(gulp.dest("www/dist"));


});

/*###################NASŁUCHIWANIE NA ZMIANY######################*/
gulp.task("watch", function() {

    //gulp.watch("www/sass/**/*.scss",["css"]); tutaj nasłuchiwanie na scss żeby działało poprawnie należy usunąć css poniżej
    gulp.watch(["www/*.html","www/**/*.js","www/css/*.css"], browserSync.reload);

});


gulp.task("default",["server","watch"]);
