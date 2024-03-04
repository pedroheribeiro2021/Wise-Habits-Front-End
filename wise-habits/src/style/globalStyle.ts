import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Lexend', sans-serif;
    /* font-weight: 400; */
    text-decoration: none;
    list-style:none;
    /* color: white; */
    /* background-color: var(--color2); */
}

body {
    background: var(--color3);
}

:root {
    --color1: #89CFF0;
    --color2: #98FF98;
    --color3: #E6E6FA;
    --color4: #FFFACD;
    --color5: #F0F0F0;

    /*mono*/

    --color6: #EBC567;
    --color7: #EBE567;
    --color8: #EBD567;
    --color9: #EBB567;
    --color10:#C8EB67;
}

input {
    border: none;
    border-radius: 4px;
    padding: 5px;
    height: 25px;
}

button {
    background: var(--color4);
    border: none;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
}

.logo {
    margin: 5% auto;
    height: 200px;
    width: 200px;
}

.modal-overlay {
    background-color: var(--color3);
  
    position: fixed;
    top: 0;
  
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    
  }

`
