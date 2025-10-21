import styled from "styled-components";

export const LoginStyle = styled.main`

    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    height: 100vh;

    form {
        gap: 10px;
        margin: 5% 0 0 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        input {
            margin-left: 5px;
        }

        button:hover {
            color: white;
            background: var(--color1);
            transition: 1.5s;
        }
    }
`