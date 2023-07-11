let apiUrl = 'http://localhost:8080/api';
export const environment = {
    production: false,
    apiUrl: apiUrl,
    baseUrl: 'http://localhost:4200',
    // media
    // defaultImageIcon: `${apiUrl}/media/defaultImageIcon.png`,
    // imageIconPartialUrl: `${apiUrl}/media`
    mediaPartialUrl: `${apiUrl}/media`,
    defaultImage: `assets/images/default-image.jpg`,
    OPEN_CAJE_API: `https://api.opencagedata.com/geocode/v1/json?q=$search&key=b357f12dbbb843ffb3f7b4f381bffbad`
};
