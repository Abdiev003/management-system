const slugify = require('slugify')

exports.generateSlug = (text) => {
    return slugify(text, {
        lower: true,
        strict: true,
    });
}