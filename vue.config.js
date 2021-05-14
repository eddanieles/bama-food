module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    publicPath: '/',
    css: {
        loaderOptions: {
            sass: {
                sassOptions: {
                    prependData: `
                  @import "@/scss/variables.scss";
                  @import "@/scss/mixins.scss";
                  @import "@/scss/functions.scss";
                `
                }
            }
        }
    }
}