interface UrlConfig {
    clientUrl:string[]
}

const developmentConfig:UrlConfig = {
    clientUrl:['http://localhost:5173']
}

const productionConfig:UrlConfig = {
    clientUrl:['https://webrtc-frontend-jqjv.onrender.com']
}

const config:UrlConfig = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig

export default config