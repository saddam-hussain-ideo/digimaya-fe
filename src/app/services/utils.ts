export function getLanguage(){
    let user, lang;
    user = localStorage.getItem('userObject');
    if (user) {
        user = JSON.parse(user);
        lang = user.Language
    } else {
        lang = localStorage.getItem('language');
        if (!lang) {
            lang = 'es';
        }
    }

    return lang
}