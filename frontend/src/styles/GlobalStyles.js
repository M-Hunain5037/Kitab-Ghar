import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.backgroundDark};
    color: ${({ theme }) => theme.colors.textLight};
    overflow: hidden; /* Prevent scrolling */
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
`;

export default GlobalStyles;
