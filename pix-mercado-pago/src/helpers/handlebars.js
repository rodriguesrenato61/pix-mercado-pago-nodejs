const exphbs = require('express-handlebars');
const { PARTIALS_DIR, LAYOUTS_DIR, VIEWS_DIR } = require('./constantes');

exports.init = function(app){
    app.engine(
        'hbs', 
        exphbs.engine({
            partialsDir: PARTIALS_DIR,
            layoutsDir: LAYOUTS_DIR
        })
    );
    app.set('view engine', 'hbs');
    app.set('views', VIEWS_DIR);
} 