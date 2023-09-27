  import storageManager from '@/plugins/storage';

export async function loadAndStoreConfigData(force = false) {
  const storedConfigData = storageManager.get('configs');
  const hasStoredData = storedConfigData && storedConfigData.expires > Date.now();
  const shouldLoadData = force || !hasStoredData;
  
  if (shouldLoadData) {
    console.log("Force");
    const response = await fetch('https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/hostname');
    const configData = await response.json();
    const hostname = storageManager.get('hostname') || window.location.hostname || 'localhost';
    const selectedConfig = configData.find(config => config.hostname === hostname);

    if (!selectedConfig) {
      throw new Error('Could not find configuration for current hostname');
    }

    const responseSpace = await fetch('https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/space/' + selectedConfig.spaceId);
    const spaceData     = await responseSpace.json();

    console.log("spaceData",spaceData);

    //console.log(selectedConfig);

    const expirationTime = Date.now() + 60000; // expiration time set to 1 minute
    const config = {
      siteID: selectedConfig._id,
      homepage: selectedConfig?.theme?.homepage  || '',
      header: selectedConfig?.theme?.header || '',
      footer: selectedConfig?.theme?.footer || '',
      navigator: selectedConfig?.theme?.navigator || '',
      siteName: selectedConfig.siteName,
      siteLogo: selectedConfig.siteLogo,
      siteFavicon: selectedConfig.siteFavicon,
      siteStyle: selectedConfig.siteStyle,
      siteSubStyle: selectedConfig.siteSubStyle,
      siteType: selectedConfig.siteType,
      loginLogo: selectedConfig.loginLogo,
      loginBg: selectedConfig.loginBg,
      plugins: selectedConfig.plugins,
      defaultPlugin: selectedConfig.defaultPlugin,
      defaultLogin: selectedConfig.defaultLogin,

      s3Key: spaceData.s3Key,
      s3Endpoint: spaceData.s3Endpoint,
      s3Hosting: spaceData.s3Hosting,
      s3Secret: spaceData.s3Secret,
      s3Region: spaceData.s3Region,
      s3EndpointDefault: spaceData.s3EndpointDefault,
      s3Bucket: spaceData.s3Bucket,
      spaceId:spaceData._id,
      
      expires: expirationTime,
      layout: selectedConfig.layout,
      menu: selectedConfig.menu,
      email_from_email: selectedConfig.email_from_email,
      email_from_name: selectedConfig.email_from_name,
      email_url: selectedConfig.email_url,
      email_key: selectedConfig.email_key,
      email_provider: selectedConfig.email_provider,

      lastUpdate: new Date().getTime() // add lastUpdate property with timestamp value
    };

    storageManager.set('configs', config);
    
    return {
      ...config,
      lastUpdate: new Date(config.lastUpdate).toLocaleString() // convert lastUpdate property to a readable format
    };
  } else {
    return {
      ...storedConfigData,
      lastUpdate: new Date(storedConfigData.lastUpdate).toLocaleString() // convert lastUpdate property to a readable format
    };
  }
}
