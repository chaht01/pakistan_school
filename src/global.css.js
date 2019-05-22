import { createGlobalStyle } from 'styled-components';
import { fonts } from './const/colors';
const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'Gilroy';
  font-style: normal;
  font-weight: 300;
  src: local('Gilroy'),
       url('./static/fonts/Gilroy-Light.woff2') format('woff2'), /* Super Modern Browsers */
       url('./static/fonts/Gilroy-Light..woff') format('woff'), /* Modern Browsers */
       url('./static/fonts/Gilroy-Light..ttf') format('truetype'), /* Safari, Android, iOS */
}

@font-face {
  font-family: 'Gilroy';
  font-style: normal;
  font-weight: 800;
  src: local('Gilroy'),
       url('./static/fonts/Gilroy-ExtraBold.woff2') format('woff2'), /* Super Modern Browsers */
       url('./static/fonts/Gilroy-ExtraBold..woff') format('woff'), /* Modern Browsers */
       url('./static/fonts/Gilroy-ExtraBold..ttf') format('truetype'), /* Safari, Android, iOS */
}
* {
  box-sizing: border-box;
}

  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;;
    color: ${fonts.darkGray};
    height: 100%;
  }
  #root{
    height: 100%;
  }
`;

export default GlobalStyle;
