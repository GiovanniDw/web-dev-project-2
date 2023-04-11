export const siteData = {
  root: 'src',
  locale: 'en',
  siteName: 'Web Dev Project 2',
  shortName: 'Project 2',
  description: 'Project 2 web',
  url: 'localhost:3000',
  ogpImage: 'ogp.jpg',
  ogType: 'website',
  fbAppId: '',
  fbAdmins: '',
  twitterCard: 'summary_large_image',
  twitterSite: '@SiteAccount',
  themeColor: '#FFA800',
  backgroundColor: '#fff'
}


export const pagesData = {
  '/index.html': {
    locale: siteData.locale,
    title: `Development template for front-end | ${siteData.siteName}`,
    description: `Welcome to VITAM! ${siteData.description}`,
    url: `${siteData.url}`,
    ogpImage: siteData.ogpImage,
    ogType: siteData.ogType,
    fbAppId: siteData.fbAppId,
    fbAdmins: siteData.fbAdmins,
    twitterCard: siteData.twitterCard,
    twitterSite: siteData.twitterSite
  },
  '/sample/index.html': {
    locale: siteData.locale,
    title: `Smaple Page | ${siteData.siteName}`,
    description: `This is a sample page. ${siteData.description}`,
    url: `${siteData.url}/sampple/`,
    ogpImage: siteData.ogpImage,
    ogType: 'article',
    fbAppId: siteData.fbAppId,
    fbAdmins: siteData.fbAdmins,
    twitterCard: siteData.twitterCard,
    twitterSite: siteData.twitterSite
  },
}