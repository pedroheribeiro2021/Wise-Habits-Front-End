import ReactModal from 'react-modal'
import { styled } from 'styled-components'

export const CreateHabitsModalStyled = styled(ReactModal)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  max-height: 100vh;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  /* background-color: var(--cover); */
  background-color: gray;
  padding: 10px;

  .container_modal_items {
    overflow-y: auto;
  }
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--cover);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--cover);
  }

  .close_modal {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    button {
      font-size: 20px;
      background-color: transparent;
      border: transparent;
      color: var(--grey4);
    }
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 5px;

    input {
      height: 30px;
      width: 100%;
      padding: 8px;
    }

    button {
      margin: 0 auto;
    }
  }

  .input-date {
    display: flex;
    flex-direction: column;
    gap: 5px;

    select {
      height: 30px;
      padding: 8px;
    }
  }
`
